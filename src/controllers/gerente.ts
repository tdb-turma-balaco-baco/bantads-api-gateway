import express, { NextFunction, Request, Response } from "express";
import httpProxy from "express-http-proxy";
import { IncomingMessage } from "http";
import { HttpStatus } from "../interfaces";


export const gerenteApi = express.Router();

gerenteApi.get(
	"/manager/list",
	(req: Request, res: Response, next: NextFunction) => {
		httpProxy(process.env.PROXY_GERENTES_URL + "", {
			userResDecorator: (
				proxyRes: IncomingMessage,
				proxyResData: any,
				userReq: Request,
				userRes: Response
			): any => {
				if (proxyRes.statusCode === HttpStatus.SUCCESS) {
					const str = Buffer.from(proxyResData).toString("utf-8");
					const gerentes: any = [];
					JSON.parse(str).array.forEach(
						(g: {
							id: any;
							name: any;
							email: any;
							phone: any;
							cpf: any;
							totalAccounts: any;
						}) => {
							const gerente = {
								id: g.id,
								nome: g.name,
								email: g.email,
								telefone: g.phone,
								totalClientes: g.totalAccounts,
							};
							gerentes.push(gerente);
						}
					);
					userRes.status(HttpStatus.SUCCESS);
					return { gerentes };
				} else {
					userRes.status(HttpStatus.UNAUTHORIZED);
					return { message: "Não foi possível recuperar o gerente" };
				}
			},
		})(req, res, next);
	}
);

gerenteApi.post(
	"/manager/save",
	(req: Request, res: Response, next: NextFunction) => {
		httpProxy(process.env.PROXY_SAGA_URL + "", {
			proxyReqBodyDecorator(bodyContent, _srcReq) {
				const retBody = {
					email: bodyContent.email,
					name: bodyContent.nome,
					cpf: bodyContent.CPF,
					phone: bodyContent.telefone,
				};
				bodyContent = retBody;
				return bodyContent;
			},
			userResDecorator: (
				proxyRes: IncomingMessage,
				proxyResData: any,
				userReq: Request,
				userRes: Response
			): any => {
				if (proxyRes.statusCode === HttpStatus.SUCCESS) {
					userRes.status(HttpStatus.SUCCESS);
					return { message: "Operação realizada!" };
				} else {
					userRes.status(HttpStatus.BAD_REQUEST);
					return { message: "Não foi possível realizar a operação" };
				}
			},
		})(req, res, next);
	}
);

gerenteApi.put(
	"/manager/update",
	(req: Request, res: Response, next: NextFunction) => {
		httpProxy(process.env.PROXY_SAGA_URL + "", {
			proxyReqBodyDecorator(bodyContent, _srcReq) {
				const retBody = {
					id: bodyContent.id,
					email: bodyContent.email,
					name: bodyContent.nome,
					cpf: bodyContent.CPF,
					phone: bodyContent.telefone,
				};
				bodyContent = retBody;
				return bodyContent;
			},
			userResDecorator: (
				proxyRes: IncomingMessage,
				proxyResData: any,
				userReq: Request,
				userRes: Response
			): any => {
				if (proxyRes.statusCode === HttpStatus.SUCCESS) {
					userRes.status(HttpStatus.SUCCESS);
					return { message: "Operação realizada!" };
				} else {
					userRes.status(HttpStatus.BAD_REQUEST);
					return { message: "Não foi possível realizar a operação" };
				}
			},
		})(req, res, next);
	}
);

gerenteApi.delete(
	"/manager/:cpf/remove",
	(req: Request, res: Response, next: NextFunction) => {
		httpProxy(process.env.PROXY_SAGA_URL + "", {
			userResDecorator: (
				proxyRes: IncomingMessage,
				proxyResData: any,
				userReq: Request,
				userRes: Response
			): any => {
				if (proxyRes.statusCode === HttpStatus.SUCCESS) {
					userRes.status(HttpStatus.SUCCESS);
					return { message: "Operação realizada!" };
				} else {
					userRes.status(HttpStatus.BAD_REQUEST);
					return { message: "Não foi possível realizar a operação" };
				}
			},
		})(req, res, next);
	}
);
