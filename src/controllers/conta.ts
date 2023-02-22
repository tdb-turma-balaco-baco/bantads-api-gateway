import express, { NextFunction, Request, Response } from "express";
import verifyJWT from "../auth/verifyJWT";
import { HttpStatus } from "../interfaces";
import { clienteServiceProxy, contaServiceProxy, gerenteServiceProxy } from "../proxy";

export const contaApi = express.Router();

contaApi.get("/", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	clienteServiceProxy("/save")(req, res, next);
});

contaApi.get("/", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	clienteServiceProxy("/list")(req, res, next);
});

contaApi.get("/:cpf", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	clienteServiceProxy("/:cpf/clientDetails")(req, res, next);
});


contaApi.get("/movimentacao", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	clienteServiceProxy("/:accountNumber/transactionsHistory")(req, res, next);
});

contaApi.post("/movimentacao", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	let proxy;

	switch(req.body.operacao) {
		case "DEPOSITO":
			proxy = clienteServiceProxy("/deposit");
			break;
		case "SAQUE":
			proxy = clienteServiceProxy("/withdraw");
			break;
		case "TRANSFERENCIA":
			proxy = clienteServiceProxy("/transfer");
			req.body.destinationAccountId = req.body.destino.conta.id;
			break;
		default:
			return res.status(HttpStatus.NOT_FOUND).send("Operação não existe!");
	}

	req.body.accountId = req.body.origem.conta.id;
	req.body.amount = req.body.valor;

	proxy(req, res, next);
});


contaApi.get("/", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	gerenteServiceProxy("/:cpf/clients")(req, res, next);
});

//Arrumar path front
contaApi.get("/", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	gerenteServiceProxy("/:cpf/pendingAccounts")(req, res, next);
});
//Arrumar path front
contaApi.get("/", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	gerenteServiceProxy("/:cpf/topFiveClients")(req, res, next);
});
//Arrumar path front
contaApi.get("/", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	gerenteServiceProxy("/:cpf/clientsBalance")(req, res, next);
});

