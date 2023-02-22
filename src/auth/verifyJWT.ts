import { NextFunction, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { HttpStatus, TypedRequest } from "../interfaces";

export default function verifyJWT(
	req: TypedRequest<{ cpf: string }>,
	res: Response,
	next: NextFunction
) {
	const token = req.headers["x-access-token"];

	if (!token) {
		return res
			.status(HttpStatus.UNAUTHORIZED)
			.json({ auth: false, message: "Token não fornecido" });
	}

	if (typeof token === "string")
			jwt.verify(token, process.env.SECRET as Secret, (error, decoded) => {
			if (error) {
				return res
					.status(HttpStatus.INTERNAL_ERROR)
					.json({ auth: false, message: "Falha na autenticação do token" });
			}
			req.body.cpf = (decoded as JwtPayload).id;
			next();
		});
}
