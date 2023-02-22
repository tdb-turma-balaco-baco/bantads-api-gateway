import express, { NextFunction, Request, Response } from "express";
import verifyJWT from "../auth/verifyJWT";
import httpProxy from "express-http-proxy";
import { gerenteServiceProxy, sagaServiceProxy } from "../proxy";


export const gerenteApi = express.Router();

