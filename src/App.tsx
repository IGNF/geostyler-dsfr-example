import { fr } from "@codegouvfr/react-dsfr";
import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import { Header } from "@codegouvfr/react-dsfr/Header";

import RMap from "./components/RMap";

const title = "Exemple d'interfaces Geostyler en DSFR";

const App = () => {
    return (
        <>
            <Header
                brandTop={title}
                homeLinkProps={{
                    href: "/",
                    title: title,
                }}
                quickAccessItems={[headerFooterDisplayItem]}
            />
            <main className={fr.cx("fr-container", "fr-my-2v")}>
                <RMap />
            </main>
        </>
    );
};

export default App;
