import { useQuery } from "@tanstack/react-query";
import { XMLParser } from "fast-xml-parser";
import LayerSwitcher from "geopf-extensions-openlayers/src/packages/Controls/LayerSwitcher/LayerSwitcher";
import GeoportalZoom from "geopf-extensions-openlayers/src/packages/Controls/Zoom/GeoportalZoom";
import OpenLayersParser from "geostyler-openlayers-parser";
import { Style as GsStyle } from "geostyler-style";
import { View } from "ol";
import Map from "ol/Map";
import { ScaleLine } from "ol/control";
import MVT from "ol/format/MVT.js";
import { defaults as defaultInteractions } from "ol/interaction";
import TileLayer from "ol/layer/Tile";
import VectorTileLayer from "ol/layer/VectorTile";
import { fromLonLat, transformExtent } from "ol/proj";
import VectorTileSource from "ol/source/VectorTile";
import WMTS, { optionsFromCapabilities } from "ol/source/WMTS";
import { FC, useEffect, useMemo, useRef } from "react";

import useCapabilities from "../hooks/useCapabilities";
import { jsonFetch } from "../modules/jsonFetch";

import olDefaults from "../data/ol-defaults.json";

import "ol/ol.css";
import "../css/olx.css";

import "geopf-extensions-openlayers/css/Dsfr.css";

type RMapProps = {
    gsStyle: GsStyle;
    serviceUrl: string;
};
const RMap: FC<RMapProps> = ({ gsStyle, serviceUrl }) => {
    const mapTargetRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<Map>();

    const metadataUrl = useMemo(() => `${serviceUrl}/metadata.json`, [serviceUrl]);

    /**************************************************************************
     * création de la couche openlayers de fond (bg layer)
     **************************************************************************/
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

    /**************************************************************************
     * création de la couche openlayers du flux (service layer)
     **************************************************************************/
    const serviceMetadataQuery = useQuery<any>({
        queryKey: [metadataUrl],
        queryFn: ({ signal }) => jsonFetch(metadataUrl, { signal }),
        staleTime: 36000,
    });
    const { data: serviceMetadata } = serviceMetadataQuery;

    const serviceInfoQuery = useQuery({
        queryKey: [serviceUrl],
        queryFn: async ({ signal }) => {
            const response = await fetch(serviceUrl, { signal });
            if (!response.ok) throw Error(`Error fetching URL ${serviceUrl}.`);

            const xml = await response.text();
            const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });

            const json = parser.parse(xml);
            return {
                title: json.TileMap.Title,
                tileSize: [parseInt(json.TileMap.TileFormat.width, 10), parseInt(json.TileMap.TileFormat.height, 10)],
            };
        },
        staleTime: 36000,
    });
    const { data: serviceInfo } = serviceInfoQuery;

    const serviceLayer = useMemo(() => {
        if (serviceMetadata === undefined || serviceInfo === undefined) return;

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

    /**************************************************************************
     * création de la carte une fois bg layer et service layer crées
     **************************************************************************/
    useEffect(() => {
        if (!bgLayer || !serviceLayer || !serviceMetadata || !serviceInfo) return;

        const controls = [
            new ScaleLine(),
            new LayerSwitcher({
                layers: [
                    {
                        layer: bgLayer,
                        config: {
                            title: "Plan IGN v2",
                        },
                    },
                    {
                        layer: serviceLayer,
                        config: {
                            title: serviceInfo.title,
                            description: serviceMetadata?.description,
                        },
                    },
                ],
                options: {
                    position: "top-right",
                    collapsed: true,
                    panel: true,
                    counter: true,
                },
            }),
            new GeoportalZoom({ position: "top-left" }),
        ];

        mapRef.current = new Map({
            target: mapTargetRef.current as HTMLElement,
            layers: [bgLayer, serviceLayer],
            interactions: defaultInteractions(),
            controls: controls,
            view: new View({
                projection: olDefaults.projection,
                center: fromLonLat(olDefaults.center),
                zoom: olDefaults.zoom,
            }),
        });
        console.log("map created");

        if (serviceMetadata.bounds) {
            const extent = transformExtent(serviceMetadata.bounds, "EPSG:4326", "EPSG:3857");

            if (extent) {
                mapRef.current.getView().fit(extent);
            }
        }

        return () => mapRef.current?.setTarget(undefined);
    }, [bgLayer, serviceLayer, serviceMetadata, serviceInfo]);

    /**************************************************************************
     * application du style
     **************************************************************************/
    useEffect(() => {
        const olParser = new OpenLayersParser();

        olParser.writeStyle(gsStyle).then((result) => {
            serviceLayer?.setStyle(result.output);
            console.log("style changed");
        });
    }, [serviceLayer, gsStyle]);

    console.log("RMap render");

    return <div ref={mapTargetRef} className="map-view" />;
};

export default RMap;
