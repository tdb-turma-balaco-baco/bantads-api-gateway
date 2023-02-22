import express, { NextFunction, Request, Response } from "express";
import httpProxy from "express-http-proxy";
import { IncomingMessage } from "http";
import { HttpStatus } from "../interfaces";

const clienteApi = express.Router();

clienteApi.get(
	"/client/:cpf/details",
	(req: Request, res: Response, next: NextFunction) => {
		httpProxy(process.env.PROXY_CLIENTES_URL + "", {
			proxyReqBodyDecorator(bodyContent, _srcReq) {
				return bodyContent;
			},
			userResDecorator: (
				proxyRes: IncomingMessage,
				proxyResData: any,
				userReq: Request,
				userRes: Response
			): any => {
				if (proxyRes.statusCode === HttpStatus.SUCCESS) {
					const str = Buffer.from(proxyResData).toString("utf-8");
					const objBody = JSON.parse(str);

					const cliente = {
						nome: objBody.name,
						CPF: objBody.cpf,
						telefone: objBody.phone,
						email: objBody.email,
						salario: objBody.wage,
						endereco: {
							id: objBody.clientAdress.id,
							logradouro: objBody.clientAdress.street,
							numero: objBody.clientAdress.number,
							complemento: objBody.clientAdress.complement,
							cep: objBody.clientAdress.cep,
							cidade: objBody.clientAdress.city,
							estado: objBody.clientAdress.state,
							tipoEndereco: objBody.clientAdress.type,
						},
					};
					userRes.status(HttpStatus.SUCCESS);
					return { cliente };
				} else {
					userRes.status(HttpStatus.UNAUTHORIZED);
					return { message: "Não foi possível recuperar o cliente" };
				}
			},
		})(req, res, next);
	}
);

clienteApi.get(
	"/client/:cpf/address",
	(req: Request, res: Response, next: NextFunction) => {
		// Vai virar compositions
		httpProxy(process.env.PROXY_CLIENTES_URL + "", {
			userResDecorator: (
				proxyRes: IncomingMessage,
				proxyResData: any,
				userReq: Request,
				userRes: Response
			): any => {
				if (proxyRes.statusCode === HttpStatus.SUCCESS) {
					const str = Buffer.from(proxyResData).toString("utf-8");
					const objBody = JSON.parse(str);

					const endereco = {
						cpf: objBody.cpf,
						cidade: objBody.city,
						estado: objBody.state,
					};

					userRes.status(HttpStatus.SUCCESS);
					return { endereco };
				} else {
					userRes.status(HttpStatus.UNAUTHORIZED);
					return { message: "Não foi possível recuperar o cliente" };
				}
			},
		})(req, res, next);
	}
);

clienteApi.post(
	"/client/save",
	(req: Request, res: Response, next: NextFunction) => {
		httpProxy(process.env.PROXY_SAGA_URL + "", {
			proxyReqBodyDecorator(bodyContent, _srcReq) {
				const retBody = {
					email: bodyContent.email,
					name: bodyContent.nome,
					cpf: bodyContent.CPF,
					phone: bodyContent.telefone,
					wage: bodyContent.salario,
					address: {
						type: bodyContent.endereco.tipoEndereco,
						street: bodyContent.endereco.logradouro,
						complement: bodyContent.endereco.complemento,
						cep: bodyContent.endereco.CEP,
						city: bodyContent.endereco.cidade,
						number: bodyContent.endereco.numero,
						state: bodyContent.endereco.estado,
					},
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

clienteApi.put(
	"/client/update",
	(req: Request, res: Response, next: NextFunction) => {
		httpProxy(process.env.PROXY_SAGA_URL + "", {
			proxyReqBodyDecorator(bodyContent, _srcReq) {
				const retBody = {
					email: bodyContent.email,
					name: bodyContent.nome,
					cpf: bodyContent.CPF,
					phone: bodyContent.telefone,
					wage: bodyContent.salario,
					address: {
						type: bodyContent.endereco.tipoEndereco,
						street: bodyContent.endereco.logradouro,
						complement: bodyContent.endereco.complemento,
						cep: bodyContent.endereco.CEP,
						city: bodyContent.endereco.cidade,
						number: bodyContent.endereco.numero,
						state: bodyContent.endereco.estado,
					},
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

clienteApi.put(
	"/client/approve",
	(req: Request, res: Response, next: NextFunction) => {
		httpProxy(process.env.PROXY_SAGA_URL + "", {
			proxyReqBodyDecorator(bodyContent, _srcReq) {
				const retBody = {
					accountNumber: bodyContent.id,
					statusReason: bodyContent.conta.motivoRecusa,
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

clienteApi.put(
	"/client/reject",
	(req: Request, res: Response, next: NextFunction) => {
		httpProxy(process.env.PROXY_SAGA_URL + "", {
			proxyReqBodyDecorator(bodyContent, _srcReq) {
				const retBody = {
					accountNumber: bodyContent.id,
					statusReason: bodyContent.conta.motivoRecusa,
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

module.exports = clienteApi;
