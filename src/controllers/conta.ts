import express, { NextFunction, Request, Response } from "express";
import { IncomingMessage } from "http";
import { Client, Cliente, HttpStatus, PendingAccount } from "../interfaces";
import httpProxy from "express-http-proxy";

const contaApi = express.Router();


contaApi.get(
	"/client/:cpf/clientDetails",
	(req: Request, res: Response, next: NextFunction) => {
		httpProxy(process.env.PROXY_TRANSACOES_URL + "", {
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
						limite: objBody.limit,
						nomeGerente: objBody.managerName,
						saldo: objBody.balance,
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

contaApi.get("/client/list", (req: Request, res: Response, next: NextFunction) => {
	httpProxy(process.env.PROXY_TRANSACOES_URL + "", {
		userResDecorator: (
			proxyRes: IncomingMessage,
			proxyResData: any,
			userReq: Request,
			userRes: Response
		): any => {
			if (proxyRes.statusCode === HttpStatus.SUCCESS) {
				const str = Buffer.from(proxyResData).toString("utf-8");
				const clientes: Cliente[] = [];

				JSON.parse(str).array.forEach(
					(c: Client) => {
						const cliente = {
							nome: c.name,
							CPF: c.cpf,
							limite: c.limit,
							nomeGerente: c.managerName,
							saldo: c.balance,
						};
						clientes.push(cliente);
					}
				);
				userRes.status(HttpStatus.SUCCESS);
				return { clientes };
			} else {
				userRes.status(HttpStatus.INTERNAL_ERROR);
				return { message: "Não foi possível recuperar os clientes" };
			}
		},
	})(req, res, next);
});

//Arrumar
contaApi.get(
	"/:contaId/transactionsHistory",
	(req: Request, res: Response, next: NextFunction) => {
		httpProxy(process.env.PROXY_TRANSACOES_URL + "", {
			proxyReqBodyDecorator(bodyContent, _srcReq) {
				const retBody = {
					startDate: bodyContent.dataInicio,
					endDate: bodyContent.dataFim,
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
					const str = Buffer.from(proxyResData).toString("utf-8");
					const transacoes: Cliente[] = [];

					JSON.parse(str).array.forEach((c: Client) => {
							const cliente: Cliente = {
								nome: c.name,
								CPF: c.cpf,
								limite: c.limit,
								nomeGerente: c.managerName,
								saldo: c.balance,
							};
							transacoes.push(cliente);
						}
					);

					userRes.status(HttpStatus.SUCCESS);
					return { transacoes };
				} else {
					userRes.status(HttpStatus.INTERNAL_ERROR);
					return { message: "Não foi possível recuperar os clientes" };
				}
			},
		})(req, res, next);
	}
);

contaApi.get(
	"/manager/:cpf/pendingAccounts",
	(req: Request, res: Response, next: NextFunction) => {
		httpProxy(process.env.PROXY_TRANSACOES_URL + "", {
			userResDecorator: (
				proxyRes: IncomingMessage,
				proxyResData: any,
				userReq: Request,
				userRes: Response
			): any => {
				if (proxyRes.statusCode === HttpStatus.SUCCESS) {
					const str = Buffer.from(proxyResData).toString("utf-8");
					const clientes: any = [];

					JSON.parse(str).array?.forEach(
						(c: PendingAccount) => {
							const conta = {
								conta: {
									id: c.accountNumber,
								},
								CPF: c.cpf,
								nome: c.name,
								salario: c.wage,
							};
							clientes.push(conta);
						}
					);

					userRes.status(HttpStatus.SUCCESS);
					return { contas: clientes };
				} else {
					userRes.status(HttpStatus.INTERNAL_ERROR);
					return { message: "Não foi possível recuperar os clientes" };
				}
			},
		})(req, res, next);
	}
);

contaApi.get(
	"/manager/:cpf/clients",
	(req: Request, res: Response, next: NextFunction) => {
		httpProxy(process.env.PROXY_TRANSACOES_URL + "", {
			userResDecorator: (
				proxyRes: IncomingMessage,
				proxyResData: any,
				userReq: Request,
				userRes: Response
			): any => {
				if (proxyRes.statusCode === HttpStatus.SUCCESS) {
					const str = Buffer.from(proxyResData).toString("utf-8");
					const clientes: any = [];
					JSON.parse(str).array.forEach(
						(c: { cpf: any; name: any; balance: any }) => {
							const cliente = {
								CPF: c.cpf,
								nome: c.name,
								saldo: c.balance,
							};
							clientes.push(cliente);
						}
					);
					userRes.status(HttpStatus.SUCCESS);
					return { clientes };
				} else {
					userRes.status(HttpStatus.INTERNAL_ERROR);
					return { message: "Não foi possível recuperar os clientes" };
				}
			},
		})(req, res, next);
	}
);

contaApi.get(
	"/manager/:cpf/topFiveClients",
	(req: Request, res: Response, next: NextFunction) => {
		httpProxy(process.env.PROXY_TRANSACOES_URL + "", {
			userResDecorator: (
				proxyRes: IncomingMessage,
				proxyResData: any,
				userReq: Request,
				userRes: Response
			): any => {
				if (proxyRes.statusCode === HttpStatus.SUCCESS) {
					const str = Buffer.from(proxyResData).toString("utf-8");
					const clientes: any = [];
					JSON.parse(str).array.forEach(
						(c: { cpf: any; name: any; balance: any }) => {
							const cliente = {
								CPF: c.cpf,
								nome: c.name,
								saldo: c.balance,
							};
							clientes.push(cliente);
						}
					);
					userRes.status(HttpStatus.SUCCESS);
					return { clientes };
				} else {
					userRes.status(HttpStatus.INTERNAL_ERROR);
					return { message: "Não foi possível recuperar os clientes" };
				}
			},
		})(req, res, next);
	}
);

// Composition
contaApi.get(
	"/manager/:cpf/clientsBalance",
	(req: Request, res: Response, next: NextFunction) => {
		httpProxy(process.env.PROXY_TRANSACOES_URL + "", {
			userResDecorator: (
				proxyRes: IncomingMessage,
				proxyResData: any,
				userReq: Request,
				userRes: Response
			): any => {
				if (proxyRes.statusCode === HttpStatus.SUCCESS) {
					const str = Buffer.from(proxyResData).toString("utf-8");
					const objJson = JSON.parse(str);
					const saldoClients = {
						saldoPositivo: objJson.totalPositiveBalance,
						saldoNegativo: objJson.totalNegativeBalance,
					};
					userRes.status(HttpStatus.SUCCESS);
					return { saldoClients };
				} else {
					userRes.status(HttpStatus.INTERNAL_ERROR);
					return { message: "Não foi possível recuperar os clientes" };
				}
			},
		})(req, res, next);
	}
);

contaApi.post(
	"/transaction/deposit",
	(req: Request, res: Response, next: NextFunction) => {
		httpProxy(process.env.PROXY_TRANSACOES_URL + "", {
			proxyReqBodyDecorator(bodyContent, _srcReq) {
				const retBody = {
					accountId: bodyContent.idContaOrigem,
					amount: bodyContent.valor,
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
					return { message: "Realizado com sucesso!" };
				} else {
					userRes.status(HttpStatus.INTERNAL_ERROR);
					return { message: "Não foi possível depositar" };
				}
			},
		})(req, res, next);
	}
);

contaApi.post(
	"/transaction/withdraw",
	(req: Request, res: Response, next: NextFunction) => {
		httpProxy(process.env.PROXY_TRANSACOES_URL + "", {
			proxyReqBodyDecorator(bodyContent, _srcReq) {
				const retBody = {
					accountId: bodyContent.idContaOrigem,
					amount: bodyContent.valor,
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
					return { message: "Realizado com sucesso!" };
				} else {
					userRes.status(HttpStatus.INTERNAL_ERROR);
					return { message: "Não foi possível sacar" };
				}
			},
		})(req, res, next);
	}
);

contaApi.post(
	"/transaction/transfer",
	(req: Request, res: Response, next: NextFunction) => {
		httpProxy(process.env.PROXY_TRANSACOES_URL + "", {
			proxyReqBodyDecorator(bodyContent, _srcReq) {
				const retBody = {
					accountId: bodyContent.idContaOrigem,
					amount: bodyContent.valor,
					destinationAccountId: bodyContent.idContaDestino,
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
					return { message: "Realizado com sucesso!" };
				} else {
					userRes.status(HttpStatus.INTERNAL_ERROR);
					return { message: "Não foi possível recuperar os clientes" };
				}
			},
		})(req, res, next);
	}
);

module.exports = contaApi;
