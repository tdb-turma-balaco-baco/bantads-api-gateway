import express, { NextFunction, Request, Response } from "express";
import verifyJWT from "../auth/verifyJWT";
import { HttpStatus } from "../interfaces";
import { contaServiceProxy } from "../proxy";

export const contaApi = express.Router();

contaApi.get("/", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	contaServiceProxy("client/list")(req, res, next);
});

contaApi.get("/:cpf", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	contaServiceProxy("client/:cpf/clientDetails")(req, res, next);
});

contaApi.get("/movimentacao/:id", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	contaServiceProxy("client/:id/transactionsHistory")(req, res, next);
});

contaApi.post("/movimentacao", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	let proxy;

	switch(req.body.operacao) {
		case "DEPOSITO":
			proxy = contaServiceProxy("transaction/deposit");
			break;
		case "SAQUE":
			proxy = contaServiceProxy("transaction/withdraw");
			break;
		case "TRANSFERENCIA":
			proxy = contaServiceProxy("transaction/transfer");
			req.body.destinationAccountId = req.body.destino.conta.id;
			break;
		default:
			return res.status(HttpStatus.NOT_FOUND).send("Operação não existe!");
	}

	req.body.accountId = req.body.origem.conta.id;
	req.body.amount = req.body.valor;

	proxy(req, res, next);
});


contaApi.get("/:cpf", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	contaServiceProxy("manager/:cpf/clients")(req, res, next);
});

//Arrumar path front
contaApi.get("/:cpf", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	contaServiceProxy("manager/:cpf/pendingAccounts")(req, res, next);
});
//Arrumar path front
contaApi.get("/:cpf", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	contaServiceProxy("manager/:cpf/topFiveClients")(req, res, next);
});
//Arrumar path front
contaApi.get("/:cpf", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	contaServiceProxy("manager/:cpf/clientsBalance")(req, res, next);
});

