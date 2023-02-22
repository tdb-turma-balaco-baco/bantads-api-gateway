import express, { NextFunction, Request, Response } from "express";
import verifyJWT from "../auth/verifyJWT";
import { HttpStatus } from "../interfaces";
import { clienteServiceProxy, contaServiceProxy, gerenteServiceProxy } from "../proxy";

export const sagaApi = express.Router();

sagaApi.post("/", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	const proxy = gerenteServiceProxy("/save");

	proxy(req, res, next);
});
sagaApi.put("/", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	const proxy = gerenteServiceProxy("/update");

	proxy(req, res, next);
});
sagaApi.delete("/", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	const proxy = gerenteServiceProxy("/:cpf/remove");
	proxy(req, res, next);
});


sagaApi.put("/", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	clienteServiceProxy("/save")(req, res, next)
});

sagaApi.put("/", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	clienteServiceProxy("/update")(req, res, next)
});
sagaApi.post("/", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	const proxy = clienteServiceProxy("/save");

	req.body.name = req.body.name;
	req.body.phone = req.body.phone;
	req.body.wage = req.body.wage;
	req.body.adress = {
		// FIXME
	};

	proxy(req, res, next);
});

sagaApi.post("/", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	const proxy = clienteServiceProxy("/approve");

	req.body.accountNumber = req.body.numeroDaConta;
	req.body.statusReason = req.body.statusConta;

	proxy(req, res, next);
});

sagaApi.post("/", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	const proxy = clienteServiceProxy("/reject");

	req.body.accountNumber = req.body.numeroDaConta;
	req.body.statusReason = req.body.statusConta;

	proxy(req, res, next);
});
