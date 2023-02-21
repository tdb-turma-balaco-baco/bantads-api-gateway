import express, { Request, Response } from "express";
import jwt,{ Secret } from "jsonwebtoken";
import { HttpStatus } from "../interfaces";

// Rotas de Autenticação
export const authApi = express.Router();

authApi.post("/login", (req: Request, res: Response) => {
	if (req.body.user === "admin" && req.body.password === "admin") {
		// Auth OK
		const id = 1;
		const token = jwt.sign({ id }, process.env.SECRET as Secret, {
			expiresIn: 300, // 5min
		});

		return res.status(HttpStatus.SUCCESS).json({ auth: true, token });
	}

	return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Login inválido!" });
});

authApi.post("/logout", (req: Request, res: Response) =>
	res.json({ auth: false, token: null })
);
