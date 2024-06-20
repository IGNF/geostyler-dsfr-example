import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";

startReactDsfr({ defaultColorScheme: "system" });

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />

            <App />
        </QueryClientProvider>
    </React.StrictMode>
);
