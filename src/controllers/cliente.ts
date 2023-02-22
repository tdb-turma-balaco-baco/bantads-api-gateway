import express, { NextFunction, Request, Response } from "express";
import verifyJWT from "../auth/verifyJWT";
import { HttpStatus } from "../interfaces";
import { clienteServiceProxy, contaServiceProxy } from "../proxy";

export const clienteApi = express.Router();

clienteApi.get("/", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	clienteServiceProxy("/list")(req, res, next);
});

clienteApi.get("/:cpf", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	clienteServiceProxy("/:cpf/details")(req, res, next);
});

clienteApi.put("/", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	clienteServiceProxy("/update")(req, res, next)
});

clienteApi.get("/movimentacao", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	clienteServiceProxy("/:accountNumber/transactionsHistory")(req, res, next);
});

clienteApi.post("/movimentacao", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	let proxy;

	switch(req.body.operacao) {
		case "DEPOSITO":
			proxy = contaServiceProxy("/deposit");
			break;
		case "SAQUE":
			proxy = contaServiceProxy("/withdraw");
			break;
		case "TRANSFERENCIA":
			proxy = contaServiceProxy("/transfer");
			req.body.destinationAccountId = req.body.destino.conta.id;
			break;
		default:
			return res.status(HttpStatus.NOT_FOUND).send("Operação não existe!");
	}

	req.body.accountId = req.body.origem.conta.id;
	req.body.amount = req.body.valor;

	proxy(req, res, next);
});

clienteApi.post("/", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	const proxy = clienteServiceProxy("/save");

	req.body.name = req.body.nome;
	req.body.phone = req.body.telefone;
	req.body.wage = req.body.salario;
	req.body.adress = {
		// FIXME
	};

	proxy(req, res, next);
});
