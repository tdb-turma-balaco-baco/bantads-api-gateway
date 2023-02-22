import express, { NextFunction, Request, Response } from "express";
import httpProxy from "express-http-proxy";
import verifyJWT from "../auth/verifyJWT";
import { HttpStatus } from "../interfaces";
import { clienteServiceProxy, contaServiceProxy, sagaServiceProxy } from "../proxy";

export const clienteApi = express.Router();


