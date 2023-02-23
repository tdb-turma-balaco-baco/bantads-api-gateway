import { Request } from "express";

export enum HttpStatus {
	SUCCESS = 200,
	UNAUTHORIZED = 401,
	INTERNAL_ERROR = 500,
	NOT_FOUND = 404,
	BAD_REQUEST = 400,
}

export interface TypedRequest<T> extends Request {
	body: T;
}

export enum TypePerfil {
	ADMIN = "ADMIN",
	MANAGER = "GERENTE",
	CLIENT = "CLIENTE",
}

export interface PendingAccount {
	accountNumber: number;
	cpf: string;
	name: string;
	wage: number;
}

export interface Client {
	name?: string;
	cpf?: string;
	limit?: number;
	managerName?: string;
	balance?: number;
}

export interface Cliente {
	nome?: string;
	CPF?: string;
	limite?: number;
	nomeGerente?: string;
	saldo?: number;
}
