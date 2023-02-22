import express, { NextFunction, Request, Response } from "express";
import verifyJWT from "../auth/verifyJWT";
import { HttpStatus } from "../interfaces";
import { clienteServiceProxy, contaServiceProxy } from "../proxy";

export const clienteApi = express.Router();

clienteApi.get("/", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	clienteServiceProxy("/:cpf/address")(req, res, next);
});

clienteApi.get("/:cpf", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	clienteServiceProxy("/:cpf/details")(req, res, next);
});
