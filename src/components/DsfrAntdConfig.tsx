import { fr } from "@codegouvfr/react-dsfr";
import { useIsDark } from "@codegouvfr/react-dsfr/useIsDark";
import { ConfigProvider } from "antd";
import { FC, PropsWithChildren } from "react";

const DsfrAntdConfig: FC<PropsWithChildren> = ({ children }) => {
    const { isDark } = useIsDark();

    const { decisions, options } = fr.colors.getHex({ isDark });

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: options.blueFrance.sun113_625.default,
                    colorSuccess: options.success._950_100.default,
                    colorError: options.error._950_100.default,
                    colorWarning: options.warning._950_100.default,
                    colorInfo: options.info._950_100.default,

                    colorBgBase: decisions.background.default.grey.default,
                    colorBorder: decisions.border.default.grey.default,
                    colorText: decisions.text.default.grey.default,
                    colorTextDisabled: decisions.text.disabled.grey.default,
                    colorTextLabel: decisions.text.label.grey.default,

                    fontSizeHeading1: 40,
                    fontSizeHeading2: 32,
                    fontSizeHeading3: 28,
                    fontSizeHeading4: 24,
                    fontSizeHeading5: 22,

                    borderRadius: 0,
                    fontFamily: "Marianne, arial, sans-serif",
                    fontSize: 16,
                    // margin: fr.spacing("10v")
                },
                components: {
                    Input: {
                        colorBgBase: decisions.background.raised.grey.default,
                        colorBgContainer: decisions.background.raised.grey.default,
                    },
                },
            }}
        >
            {children}
        </ConfigProvider>
    );
};

export default DsfrAntdConfig;
