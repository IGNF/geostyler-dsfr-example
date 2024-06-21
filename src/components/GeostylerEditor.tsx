import { fr } from "@codegouvfr/react-dsfr";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import { CardStyle, CodeEditor, GeoStylerContext, GeoStylerContextInterface, Style, locale } from "geostyler";
import MapboxStyleParser from "geostyler-mapbox-parser";
import QGISStyleParser from "geostyler-qgis-parser";
import SldStyleParser from "geostyler-sld-parser";
import { Style as GsStyle } from "geostyler-style";
import { FC } from "react";

import DsfrAntdConfig from "./DsfrAntdConfig";

const qgisParser = new QGISStyleParser();
qgisParser.title = "QML (QGIS)";

const mbParser = new MapboxStyleParser({
    pretty: true,
});
const sld100Parser = new SldStyleParser({
    sldVersion: "1.0.0",
});
sld100Parser.title = "SLD 1.0.0";

const sld110Parser = new SldStyleParser({
    sldVersion: "1.1.0",
});
sld110Parser.title = "SLD 1.1.0";

type GeostylerEditorProps = {
    gsStyle: GsStyle;
    onStyleChange?: (style: GsStyle) => void;
};

const GeostylerEditor: FC<GeostylerEditorProps> = ({ gsStyle, onStyleChange }) => {
    const ctx: GeoStylerContextInterface = {
        composition: {},
        locale: locale.fr_FR,
    };

    return (
        <GeoStylerContext.Provider value={ctx}>
            <DsfrAntdConfig>
                <Tabs
                    label="Editeur de style"
                    tabs={[
                        {
                            label: "Tableau",
                            content: (
                                <div className={fr.cx("fr-grid-row", "fr-my-2w")}>
                                    <div className={fr.cx("fr-col")}>
                                        <Style style={gsStyle} onStyleChange={onStyleChange} />
                                    </div>
                                </div>
                            ),
                        },
                        {
                            label: "Cartes",
                            content: (
                                <div className={fr.cx("fr-grid-row", "fr-my-2w")}>
                                    <div className={fr.cx("fr-col")}>
                                        <CardStyle style={gsStyle} onStyleChange={onStyleChange} />
                                    </div>
                                </div>
                            ),
                        },
                        {
                            label: "Editeur de code",
                            content: (
                                <div className={fr.cx("fr-grid-row", "fr-my-2w")}>
                                    <div className={fr.cx("fr-col")}>
                                        <CodeEditor
                                            style={gsStyle}
                                            onStyleChange={onStyleChange}
                                            showCopyButton={true}
                                            showSaveButton={true}
                                            defaultParser={mbParser}
                                            parsers={[mbParser, qgisParser, sld100Parser, sld110Parser]}
                                        />
                                    </div>
                                </div>
                            ),
                        },
                    ]}
                />
            </DsfrAntdConfig>
        </GeoStylerContext.Provider>
    );
};

export default GeostylerEditor;
