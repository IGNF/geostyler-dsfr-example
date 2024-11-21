import { fr } from "@codegouvfr/react-dsfr";
import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import Footer from "@codegouvfr/react-dsfr/Footer";
import { Header } from "@codegouvfr/react-dsfr/Header";
import Input from "@codegouvfr/react-dsfr/Input";
import { useQuery } from "@tanstack/react-query";
import MapboxStyleParser, { MbStyle } from "geostyler-mapbox-parser";
import { Style as GsStyle } from "geostyler-style";
import { useEffect, useState } from "react";

import GeostylerEditor from "./components/GeostylerEditor";
import GeostylerLegend from "./components/GeostylerLegend";
import RMap from "./components/RMap";
import { jsonFetch } from "./modules/jsonFetch";

const title = "Exemple d'interfaces Geostyler en DSFR";

export const LAYER_NAME = "OCSGE_DI_031_2022_IGN";
// const SERVICE_URL = `https://data.geopf.fr/tms/1.0.0/${LAYER_NAME}/{z}/{x}/{y}.pbf`;
const DEFAULT_SERVICE_INFO_URL = `https://data.geopf.fr/tms/1.0.0/${LAYER_NAME}`;

export const DEFAULT_STYLE_URL =
    "https://data.geopf.fr/annexes/ccommunaute-test_xavier/style/c426b115-e0fa-4bbc-bbb6-f79383829665.json";

const mbParser = new MapboxStyleParser();

const urlSearchParams = new URLSearchParams(window.location.search);
const qServiceUrl = urlSearchParams.get("service_url");
const qStyleUrl = urlSearchParams.get("style_url");

const App = () => {
    const [serviceUrl, setServiceUrl] = useState<string>(qServiceUrl ?? DEFAULT_SERVICE_INFO_URL);
    const [styleUrl, setStyleUrl] = useState<string>(qStyleUrl ?? DEFAULT_STYLE_URL);

    const mbStyleQuery = useQuery({
        queryKey: [styleUrl],
        queryFn: ({ signal }) => jsonFetch<MbStyle>(styleUrl, { signal }),
        staleTime: Infinity,
    });

    const [gsStyle, setGsStyle] = useState<GsStyle>();

    useEffect(() => {
        if (mbStyleQuery.data) {
            mbParser.readStyle(mbStyleQuery.data).then((result) => {
                if (result.output) {
                    setGsStyle(result.output);
                }
            });
        }
    }, [mbStyleQuery.data]);

    useEffect(() => {
        // updating the URL with the new service and style URL as they change
        const newURL = new URL(window.location.origin + window.location.pathname);
        const urlSearchParams = new URLSearchParams();

        if (serviceUrl.length > 0) {
            urlSearchParams.set("service_url", serviceUrl);
        }
        if (styleUrl.length > 0) {
            urlSearchParams.set("style_url", styleUrl);
        }
        newURL.search = urlSearchParams.toString();

        window.history.replaceState({ path: newURL.href }, "", newURL.href);
    }, [serviceUrl, styleUrl]);

    return (
        <>
            <Header
                brandTop={
                    <>
                        République
                        <br />
                        Française
                    </>
                }
                homeLinkProps={{
                    href: "./",
                    title: title,
                }}
                serviceTitle={title}
                quickAccessItems={[headerFooterDisplayItem]}
            />
            <main className={fr.cx("fr-container", "fr-my-2v")}>
                <Input
                    label={"URL du flux tuiles vectorielles"}
                    nativeInputProps={{
                        value: serviceUrl,
                        onChange: (e) => setServiceUrl(e.currentTarget.value),
                        placeholder: DEFAULT_SERVICE_INFO_URL,
                    }}
                />
                <Input
                    label={"URL du style mapbox"}
                    nativeInputProps={{
                        value: styleUrl,
                        onChange: (e) => setStyleUrl(e.currentTarget.value),
                        placeholder: DEFAULT_STYLE_URL,
                    }}
                />

                {gsStyle !== undefined && (
                    <>
                        <div className={fr.cx("fr-grid-row", "fr-my-2w")}>
                            <div className={fr.cx("fr-col-12", "fr-col-lg-8")}>
                                <RMap gsStyle={gsStyle} serviceUrl={serviceUrl} />
                            </div>
                            <div className={fr.cx("fr-col-12", "fr-col-lg-4")}>
                                <GeostylerLegend gsStyle={gsStyle} />
                            </div>
                        </div>

                        <div className={fr.cx("fr-grid-row", "fr-my-2w")}>
                            <div className={fr.cx("fr-col")}>
                                <GeostylerEditor gsStyle={gsStyle} onStyleChange={(gsStyle) => setGsStyle(gsStyle)} />
                            </div>
                        </div>
                    </>
                )}
            </main>
            <Footer accessibility="non compliant" bottomItems={[headerFooterDisplayItem]} />
        </>
    );
};

export default App;
