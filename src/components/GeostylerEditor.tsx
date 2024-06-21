import { fr } from "@codegouvfr/react-dsfr";
import { CardStyle, CodeEditor, Style } from "geostyler";
import { Style as GsStyle } from "geostyler-style";
import { FC } from "react";

import DsfrAntdConfig from "./DsfrAntdConfig";

type GeostylerEditorProps = {
    gsStyle: GsStyle;
    onStyleChange?: (style: GsStyle) => void;
};

const GeostylerEditor: FC<GeostylerEditorProps> = ({ gsStyle, onStyleChange }) => {
    return (
        <DsfrAntdConfig>
            <div className={fr.cx("fr-grid-row", "fr-my-2w")}>
                <div className={fr.cx("fr-col")}>
                    <Style style={gsStyle} onStyleChange={onStyleChange} />
                </div>
            </div>
            <div className={fr.cx("fr-grid-row", "fr-my-2w")}>
                <div className={fr.cx("fr-col")}>
                    <CardStyle style={gsStyle} onStyleChange={onStyleChange} />
                </div>
            </div>
            <div className={fr.cx("fr-grid-row", "fr-my-2w")}>
                <div className={fr.cx("fr-col")}>
                    <CodeEditor style={gsStyle} onStyleChange={onStyleChange} />
                </div>
            </div>
        </DsfrAntdConfig>
    );
};

export default GeostylerEditor;
