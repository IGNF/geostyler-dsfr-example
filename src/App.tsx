import { fr } from "@codegouvfr/react-dsfr";
import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import { Header } from "@codegouvfr/react-dsfr/Header";
import { useQuery } from "@tanstack/react-query";
import MapboxStyleParser, { MbStyle } from "geostyler-mapbox-parser";
import { Style as GsStyle } from "geostyler-style";

import { useEffect, useState } from "react";
import GeostylerEditor from "./components/GeostylerEditor";
import RMap, { LAYER_NAME, STYLE_URL } from "./components/RMap";
import { jsonFetch } from "./modules/jsonFetch";
import Footer from "@codegouvfr/react-dsfr/Footer";

const title = "Exemple d'interfaces Geostyler en DSFR";

const mbParser = new MapboxStyleParser();

const App = () => {
    const mbStyleQuery = useQuery({
        queryKey: ["service", LAYER_NAME, "style"],
        queryFn: ({ signal }) => jsonFetch<MbStyle>(STYLE_URL, { signal }),
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
                    href: "/",
                    title: title,
                }}
                serviceTitle={title}
                quickAccessItems={[headerFooterDisplayItem]}
            />
            <main className={fr.cx("fr-container", "fr-my-2v")}>
                {gsStyle !== undefined && (
                    <>
                        <div className={fr.cx("fr-grid-row", "fr-my-2w")}>
                            <div className={fr.cx("fr-col")}>
                                <RMap gsStyle={gsStyle} />
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
