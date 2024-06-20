export async function jsonFetch<T>(
    url: RequestInfo | URL,
    config: Omit<RequestInit, "body"> = {},
    body: FormData | object | null = null
): Promise<T> {
    return new Promise((resolve, reject) => {
        (async function () {
            const defaultHeaders: HeadersInit = {};

            const fetchConfig: RequestInit = { ...config };

            // convertir en chaîne JSON
            fetchConfig.body = body && typeof body === "object" ? JSON.stringify(body) : body;

            fetchConfig.headers = {
                ...defaultHeaders,
                ...config.headers,
            };

            const request = new Request(url, fetchConfig);

            try {
                const response = await fetch(request);

                // retourner un objet vide si la réponse n'a pas de body (dans un cas de 204 par exemple)
                const data = await response.json().catch(() => ({}));

                if (response.ok) {
                    resolve(data);
                } else {
                    reject(data);
                }
            } catch (error) {
                if (error instanceof DOMException && error?.name === "AbortError") {
                    // NOTE : ne rien faire, requête annulée par react-query parce que requête en doublon (en mode strict de react)
                } else {
                    reject(error);
                }
            }
        })();
    });
}
