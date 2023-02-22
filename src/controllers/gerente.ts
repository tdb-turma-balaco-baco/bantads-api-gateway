import express, { NextFunction, Request, Response } from "express";
import verifyJWT from "../auth/verifyJWT";
import httpProxy from "express-http-proxy";

const getEndpoints = new Map<string, string>();
getEndpoints.set("", "/list");

export const gerenteApi = express.Router();

getEndpoints.forEach((service, host) => {
	const proxy = getGerenteServiceProxy(service);

	gerenteApi.get(
		host,
		verifyJWT,
		async (req: Request, res: Response, next: NextFunction) => {
			proxy(req, res, next);
		}
	);
});

function getGerenteServiceProxy(endpoint: string) {
	return httpProxy(
		process.env.PROXY_GERENTES_URL + endpoint
		?? "http://localhost:8080/"
	)
}
