import { useQuery } from "@tanstack/react-query";
import { XMLParser } from "fast-xml-parser";
import { View } from "ol";
import Map from "ol/Map";
import { ScaleLine, defaults as defaultControls } from "ol/control";
import MVT from "ol/format/MVT.js";
import { defaults as defaultInteractions } from "ol/interaction";
import TileLayer from "ol/layer/Tile";
import VectorTileLayer from "ol/layer/VectorTile";
import { fromLonLat, transformExtent } from "ol/proj";
import VectorTileSource from "ol/source/VectorTile";
import WMTS, { optionsFromCapabilities } from "ol/source/WMTS";
import { FC, useCallback, useEffect, useMemo, useRef } from "react";

import useCapabilities from "../hooks/useCapabilities";
import { jsonFetch } from "../modules/jsonFetch";

import olDefaults from "../data/ol-defaults.json";

import "ol/ol.css";
import "../css/olx.css";


const LAYER_NAME = "OCSGE_DI_031_2022_IGN";
// const SERVICE_URL = `https://data.geopf.fr/tms/1.0.0/${LAYER_NAME}/{z}/{x}/{y}.pbf`;
const SERVICE_INFO_URL = `https://data.geopf.fr/tms/1.0.0/${LAYER_NAME}`;
const METADATA_URL = `https://data.geopf.fr/tms/1.0.0/${LAYER_NAME}/metadata.json`;

const RMap: FC = () => {
    const mapTargetRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<Map>();

    // bg layer
    const { data: capabilities } = useCapabilities();

    const bgLayer = useMemo(() => {
        if (!capabilities) return;

        const wmtsOptions = optionsFromCapabilities(capabilities, {
            layer: olDefaults.default_background_layer,
        });

        if (!wmtsOptions) return;

        const bgLayer = new TileLayer();
        bgLayer.setSource(new WMTS(wmtsOptions));

        return bgLayer;
    }, [capabilities]);

    // data layer
    const serviceMetadataQuery = useQuery({
        queryKey: ["service", LAYER_NAME, "metadata"],
        queryFn: ({ signal }) => jsonFetch(METADATA_URL, { signal }),
    });
    const { data: serviceMetadata } = serviceMetadataQuery;

    const getInfo = useCallback(
        async (url: string, config: RequestInit): Promise<{ title: string; tileSize: number[] }> => {
            const response = await fetch(url, config);
            if (!response.ok) throw Error(`Error fetching URL ${url}.`);

            const xml = await response.text();
            const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });

            const json = parser.parse(xml);
            return {
                title: json.TileMap.Title,
                tileSize: [parseInt(json.TileMap.TileFormat.width, 10), parseInt(json.TileMap.TileFormat.height, 10)],
            };
        },
        []
    );

    const serviceInfoQuery = useQuery({
        queryKey: ["service", LAYER_NAME, "info"],
        queryFn: ({ signal }) => {
            return getInfo(SERVICE_INFO_URL, { signal });
        },
    });
    const { data: serviceInfo } = serviceInfoQuery;

    const dataLayer = useMemo(() => {
        if (serviceMetadata === undefined || serviceInfo === undefined) return;

        console.log(serviceInfo, serviceMetadata);

        const layer = new VectorTileLayer({
            minZoom: serviceMetadata?.minzoom,
            maxZoom: serviceMetadata?.maxzoom,
            declutter: true,
            source: new VectorTileSource({
                url: serviceMetadata?.tiles?.[0],
                format: new MVT(),
                minZoom: serviceMetadata?.minzoom,
                maxZoom: serviceMetadata?.maxzoom,
                tileSize: serviceInfo.tileSize,
            }),
            properties: {
                title: serviceInfo.title,
                abstract: serviceMetadata?.description,
            },
        });
        return layer;
    }, [serviceMetadata, serviceInfo]);

    // création de la carte une fois bg layer et data layer crées
    useEffect(() => {
        if (!bgLayer || !dataLayer || !serviceMetadata) return;

        const controls = defaultControls();
        controls.push(new ScaleLine())

        mapRef.current = new Map({
            target: mapTargetRef.current as HTMLElement,
            layers: [bgLayer, dataLayer],
            interactions: defaultInteractions(),
            controls: controls,
            view: new View({
                projection: olDefaults.projection,
                center: fromLonLat(olDefaults.center),
                zoom: olDefaults.zoom,
            }),
        });

        if (serviceMetadata.bounds) {
            const extent = transformExtent(serviceMetadata.bounds, "EPSG:4326", "EPSG:3857");

            if (extent) {
                mapRef.current.getView().fit(extent);
            }
        }

        return () => mapRef.current?.setTarget(undefined);
    }, [bgLayer, dataLayer, serviceMetadata]);

    return <div ref={mapTargetRef} className="map-view" />;
};

export default RMap;