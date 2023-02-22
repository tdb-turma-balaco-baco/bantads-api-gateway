import express, { NextFunction, Request, Response } from "express";
import verifyJWT from "../auth/verifyJWT";
import httpProxy from "express-http-proxy";
import { gerenteServiceProxy } from "../proxy";


export const gerenteApi = express.Router();

//Arrumar path front
gerenteApi.get("/", verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	gerenteServiceProxy("/list")(req, res, next);
});
