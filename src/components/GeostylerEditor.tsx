import { fr } from "@codegouvfr/react-dsfr";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import { CardStyle, CodeEditor, GeoStylerContext, GeoStylerContextInterface, Style } from "geostyler";
import { Style as GsStyle } from "geostyler-style";
import { FC } from "react";

import DsfrAntdConfig from "./DsfrAntdConfig";

type GeostylerEditorProps = {
    gsStyle: GsStyle;
    onStyleChange?: (style: GsStyle) => void;
};

const GeostylerEditor: FC<GeostylerEditorProps> = ({ gsStyle, onStyleChange }) => {
    const ctx: GeoStylerContextInterface = {
        composition: {},
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
