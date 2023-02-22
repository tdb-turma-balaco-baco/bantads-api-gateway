import httpProxy from "express-http-proxy";

export const clienteServiceProxy = (endpoint: string = "") => createServiceProxy(process.env.PROXY_CLIENTES_URL, endpoint);
export const gerenteServiceProxy = (endpoint: string = "") => createServiceProxy(process.env.PROXY_GERENTES_URL, endpoint);
export const contaServiceProxy = (endpoint: string = "") => createServiceProxy(process.env.PROXY_TRANSACOES_URL, endpoint);

function createServiceProxy(proxyURL: string | undefined, endpoint: string) {
	return httpProxy(proxyURL ? proxyURL + endpoint : "http://localhost:8080/" + endpoint);
}
