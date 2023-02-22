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
