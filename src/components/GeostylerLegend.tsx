import { fr } from "@codegouvfr/react-dsfr";
import { LegendRenderer } from "geostyler-legend";
import { Style as GsStyle } from "geostyler-style";
import { FC, useEffect, useRef } from "react";

type GeostylerLegendProps = {
    gsStyle: GsStyle;
};

const GeostylerLegend: FC<GeostylerLegendProps> = ({ gsStyle }) => {
    const legendTargetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (gsStyle && legendTargetRef.current) {
            const renderer = new LegendRenderer({
                maxColumnWidth: 200,
                // maxColumnHeight: 600,
                // overflow: "group",
                // @ts-expect-error // TODO
                styles: [gsStyle],
                size: [200, 200],
                hideRect: true,
            });

            renderer.render(legendTargetRef.current);
        }
    }, [gsStyle]);
    return <div className={fr.cx("fr-p-1v")} ref={legendTargetRef} />;
};

export default GeostylerLegend;
