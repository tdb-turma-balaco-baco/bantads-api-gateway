import dotenv from "dotenv-safe";
import express, {
    NextFunction,
    Router,
    Request,
    Response,
} from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import helmet from "helmet";
import httpProxy from "express-http-proxy";
import cors from "cors";
import { authApi } from "./controllers/auth";
import verifyJWT from "./auth/verifyJWT";
import jwt,{ Secret } from "jsonwebtoken";

const app = express();
const route = Router();

// Configurações do servidor express
dotenv.config();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(route);
app.use(cors());
app.use(helmet());
app.use(logger("dev"));
app.use(cookieParser());

const usuariosServiceProxy = httpProxy("http://localhost:5009/");

route.get("/", (req: Request, res: Response) =>
    res.status(200).json({ message: "Olá mundo" })
);

app.use(authApi);

route.get(
    "/client/12321/address2",
    (req: Request, res: Response, next: NextFunction) =>
        usuariosServiceProxy(req, res, next)
);

//CLIENTE - INICIO

route.get("/client/:cpf/details", (req: Request, res: Response, next: NextFunction) => {
	httpProxy(process.env.PROXY_CLIENTES_URL + '', {
		proxyReqBodyDecorator(bodyContent, srcReq) {
			return bodyContent;
		},
    userResDecorator: (proxyRes:any, proxyResData:any, userReq:any, userRes:any): any => {
      if (proxyRes.statusCode === 200) {
				const str = Buffer.from(proxyResData).toString('utf-8');
        const objBody = JSON.parse(str);
				var cliente = {
						nome : objBody.name,
						cpf : objBody.cpf,
						telefone : objBody.phone,
						email : objBody.email,
						salario : objBody.wage,
						endereco : {
							id : objBody.clientAdress.id,
							rua : objBody.clientAdress.street,
							numero : objBody.clientAdress.number,
							complemento : objBody.clientAdress.complement,
							cep : objBody.clientAdress.cep,
							cidade : objBody.clientAdress.city,
							estado : objBody.clientAdress.state
						}
				};
        userRes.status(200);
        return { cliente };
      } else {
        userRes.status(401);
        return { message: 'Não foi possível recuperar o cliente'};
      }
    },
  })(req,res,next);
});

route.get("/client/:cpf/address", (req: Request, res: Response, next: NextFunction) => { //Vai virar compositions
	httpProxy(process.env.PROXY_CLIENTES_URL + '', {
    userResDecorator: (proxyRes:any, proxyResData:any, userReq:any, userRes:any): any => {
      if (proxyRes.statusCode === 200) {
				const str = Buffer.from(proxyResData).toString('utf-8');
        const objBody = JSON.parse(str);
				var endereco = {
						cpf : objBody.cpf,
						cidade : objBody.city,
						estado : objBody.state
				};
        userRes.status(200);
        return { endereco };
      } else {
        userRes.status(401);
        return { message: 'Não foi possível recuperar o cliente'};
      }
    },
  })(req,res,next);
});

route.post("/client/save", (req: Request, res: Response, next: NextFunction) => {
	httpProxy(process.env.PROXY_SAGA_URL + '', {
		proxyReqBodyDecorator(bodyContent, srcReq) {
			var retBody = {
				email : bodyContent.email,
				name : bodyContent.nome,
				cpf : bodyContent.CPF,
				phone : bodyContent.telefone,
				wage : bodyContent.salario,
				address : {
					type : bodyContent.endereco.tipo,
					street : bodyContent.endereco.logradouro,
					complement : bodyContent.endereco.complemento,
					cep : bodyContent.endereco.CEP,
					city : bodyContent.endereco.cidade,
					number : bodyContent.endereco.numero,
					state : bodyContent.endereco.estado,
				}
			};
      bodyContent = retBody;
			return bodyContent;
		},
    userResDecorator: (proxyRes:any, proxyResData:any, userReq:any, userRes:any): any => {
      if (proxyRes.statusCode === 200) {
        userRes.status(200);
        return { message : "Operação realizada!" };
      } else {
        userRes.status(400);
        return { message: 'Não foi possível realizar a operação'};
      }
    },
  })(req, res, next);
});


route.put("/client/update", (req: Request, res: Response, next: NextFunction) => {
	httpProxy(process.env.PROXY_SAGA_URL + '', {
		proxyReqBodyDecorator(bodyContent, srcReq) {
			var retBody = {
				email : bodyContent.email,
				name : bodyContent.nome,
				cpf : bodyContent.CPF,
				phone : bodyContent.telefone,
				wage : bodyContent.salario,
				address : {
					type : bodyContent.endereco.tipo,
					street : bodyContent.endereco.logradouro,
					complement : bodyContent.endereco.complemento,
					cep : bodyContent.endereco.CEP,
					city : bodyContent.endereco.cidade,
					number : bodyContent.endereco.numero,
					state : bodyContent.endereco.estado,
				}
			};
      bodyContent = retBody;
			return bodyContent;
		},
    userResDecorator: (proxyRes:any, proxyResData:any, userReq:any, userRes:any): any => {
      if (proxyRes.statusCode === 200) {
        userRes.status(200);
        return { message : "Operação realizada!" };
      } else {
        userRes.status(400);
        return { message: 'Não foi possível realizar a operação'};
      }
    },
  })(req, res, next);
});

route.put("/client/approve", (req: Request, res: Response, next: NextFunction) => {
	httpProxy(process.env.PROXY_SAGA_URL + '', {
		proxyReqBodyDecorator(bodyContent, srcReq) {
			var retBody = {
				accountNumber : bodyContent.id,
				statusReason : bodyContent.motivo,
			};
      bodyContent = retBody;
			return bodyContent;
		},
    userResDecorator: (proxyRes:any, proxyResData:any, userReq:any, userRes:any): any => {
      if (proxyRes.statusCode === 200) {
        userRes.status(200);
        return { message : "Operação realizada!" };
      } else {
        userRes.status(400);
        return { message: 'Não foi possível realizar a operação'};
      }
    },
  })(req, res, next);
});

route.put("/client/reject", (req: Request, res: Response, next: NextFunction) => {
	httpProxy(process.env.PROXY_SAGA_URL + '', {
		proxyReqBodyDecorator(bodyContent, srcReq) {
			var retBody = {
				accountNumber : bodyContent.id,
				statusReason : bodyContent.motivo,
			};
      bodyContent = retBody;
			return bodyContent;
		},
    userResDecorator: (proxyRes:any, proxyResData:any, userReq:any, userRes:any): any => {
      if (proxyRes.statusCode === 200) {
        userRes.status(200);
        return { message : "Operação realizada!" };
      } else {
        userRes.status(400);
        return { message: 'Não foi possível realizar a operação'};
      }
    },
  })(req, res, next);
});
//FIM CLIENTE

//INICIO GERENTE
route.get("/manager/list", (req: Request, res: Response, next: NextFunction) => {
	httpProxy(process.env.PROXY_GERENTES_URL + '', {
    userResDecorator: (proxyRes:any, proxyResData:any, userReq:any, userRes:any): any => {
      if (proxyRes.statusCode === 200) {
				const str = Buffer.from(proxyResData).toString('utf-8');
				var gerentes:any = [];
        JSON.parse(str).array.forEach((g: { id: any; name: any; email: any; phone: any; cpf: any; totalAccounts:any; }) => {
					var gerente = {
						id : g.id,
						nome : g.name,
						email : g.email,
						telefone : g.phone,
						totalClients : g.totalAccounts
					};
					gerentes.push(gerente);
				});;
        userRes.status(200);
        return { gerentes };
      } else {
        userRes.status(401);
        return { message: 'Não foi possível recuperar o gerente'};
      }
    },
  })(req,res,next);
});

route.post("/manager/save", (req: Request, res: Response, next: NextFunction) => {
	httpProxy(process.env.PROXY_SAGA_URL + '', {
		proxyReqBodyDecorator(bodyContent, srcReq) {
			var retBody = {
				email : bodyContent.email,
				name : bodyContent.nome,
				cpf : bodyContent.CPF,
				phone : bodyContent.telefone
			};
      bodyContent = retBody;
			return bodyContent;
		},
    userResDecorator: (proxyRes:any, proxyResData:any, userReq:any, userRes:any): any => {
      if (proxyRes.statusCode === 200) {
        userRes.status(200);
        return { message : "Operação realizada!" };
      } else {
        userRes.status(400);
        return { message: 'Não foi possível realizar a operação'};
      }
    },
  })(req, res, next);
});

route.put("/manager/update", (req: Request, res: Response, next: NextFunction) => {
	httpProxy(process.env.PROXY_SAGA_URL + '', {
		proxyReqBodyDecorator(bodyContent, srcReq) {
			var retBody = {
				id : bodyContent.id,
				email : bodyContent.email,
				name : bodyContent.nome,
				cpf : bodyContent.CPF,
				phone : bodyContent.telefone
			};
      bodyContent = retBody;
			return bodyContent;
		},
    userResDecorator: (proxyRes:any, proxyResData:any, userReq:any, userRes:any): any => {
      if (proxyRes.statusCode === 200) {
        userRes.status(200);
        return { message : "Operação realizada!" };
      } else {
        userRes.status(400);
        return { message: 'Não foi possível realizar a operação'};
      }
    },
  })(req, res, next);
});

route.delete("/manager/:cpf/remove", (req: Request, res: Response, next: NextFunction) => {
	httpProxy(process.env.PROXY_SAGA_URL + '', {
    userResDecorator: (proxyRes:any, proxyResData:any, userReq:any, userRes:any): any => {
      if (proxyRes.statusCode === 200) {
        userRes.status(200);
        return { message : "Operação realizada!" };
      } else {
        userRes.status(400);
        return { message: 'Não foi possível realizar a operação'};
      }
    },
  })(req, res, next);
});
//FIM GERENTE


//LOGIN
authApi.post("/login", (req: Request, res: Response, next: NextFunction) => {
	httpProxy(process.env.PROXY_AUTH_URL + '', {
		proxyReqBodyDecorator(bodyContent, srcReq) {
			var retBody = {
				email : bodyContent.email,
				password : bodyContent.senha
			};
      bodyContent = retBody;
			return bodyContent;
		},
    userResDecorator: (proxyRes:any, proxyResData:any, userReq:any, userRes:any): any => {
			if (proxyRes.statusCode === 200) {
				const retorno = Buffer.from(proxyResData).toString('utf-8');
				const id = JSON.parse(retorno);
				const token = jwt.sign({ id }, process.env.SECRET as Secret, {
					expiresIn: 300,
				});
				userRes.status(200);
				return { auth: true, token };
			}
    },
  })(req, res, next);
});

authApi.post("/logout", (req: Request, res: Response) =>
	res.json({ auth: false, token: null })
);
//FIM LOGIN


//CONTA
route.get("/client/:cpf/clientDetails", (req: Request, res: Response, next: NextFunction) => {
	httpProxy(process.env.PROXY_CONTA_URL + '', {
    userResDecorator: (proxyRes:any, proxyResData:any, userReq:any, userRes:any): any => {
      if (proxyRes.statusCode === 200) {
				const str = Buffer.from(proxyResData).toString('utf-8');
        const objBody = JSON.parse(str);
				var cliente = {
						nome : objBody.name,
						cpf : objBody.cpf,
						limite : objBody.limit,
						nomeGerente : objBody.managerName,
						saldo : objBody.balance
				};
        userRes.status(200);
        return { cliente };
      } else {
        userRes.status(401);
        return { message: 'Não foi possível recuperar o cliente'};
      }
    },
  })(req,res,next);
});

route.get("/client/list", (req: Request, res: Response, next: NextFunction) => {
	httpProxy(process.env.PROXY_CONTA_URL + '', {
    userResDecorator: (proxyRes:any, proxyResData:any, userReq:any, userRes:any): any => {
      if (proxyRes.statusCode === 200) {
				const str = Buffer.from(proxyResData).toString('utf-8');
				var clientes:any = [];
        JSON.parse(str).array.forEach((c: { name: any; cpf: any; limit: any; managerName: any; balance: any; }) => {
					var cliente = {
							nome : c.name,
							cpf : c.cpf,
							limite : c.limit,
							nomeGerente : c.managerName,
							saldo : c.balance
					};
					clientes.push(cliente);
				});;
        userRes.status(200);
        return { clientes };
      } else {
        userRes.status(500);
        return { message: 'Não foi possível recuperar os clientes'};
      }
    },
  })(req,res,next);
});
//Arrumar
route.get("/:contaId/transactionsHistory", (req: Request, res: Response, next: NextFunction) => {
	httpProxy(process.env.PROXY_CONTA_URL + '', {
		proxyReqBodyDecorator(bodyContent, srcReq) {
			var retBody = {
				startDate : bodyContent.dataInicio,
				endDate : bodyContent.dataFim
			};
      bodyContent = retBody;
			return bodyContent;
		},
    userResDecorator: (proxyRes:any, proxyResData:any, userReq:any, userRes:any): any => {
      if (proxyRes.statusCode === 200) {
				const str = Buffer.from(proxyResData).toString('utf-8');
				var transacoes:any = [];
        JSON.parse(str).array.forEach((c: { name: any; cpf: any; limit: any; managerName: any; balance: any; }) => {
					var cliente = {
							nome : c.name,
							cpf : c.cpf,
							limite : c.limit,
							nomeGerente : c.managerName,
							saldo : c.balance
					};
					transacoes.push(cliente);
				});;
        userRes.status(200);
        return { transacoes };
      } else {
        userRes.status(500);
        return { message: 'Não foi possível recuperar os clientes'};
      }
    },
  })(req,res,next);
});

route.get("/manager/:cpf/pendingAccounts", (req: Request, res: Response, next: NextFunction) => {
	httpProxy(process.env.PROXY_CONTA_URL + '', {
    userResDecorator: (proxyRes:any, proxyResData:any, userReq:any, userRes:any): any => {
      if (proxyRes.statusCode === 200) {
				const str = Buffer.from(proxyResData).toString('utf-8');
				var contas:any = [];
        JSON.parse(str).array.forEach((c: { accountNumber: any; cpf: any; name: any; wage: any; }) => {
					var conta = {
							idConta : c.accountNumber,
							cpf : c.cpf,
							nome : c.name,
							salario : c.wage,
					};
					contas.push(conta);
				});;
        userRes.status(200);
        return { contas };
      } else {
        userRes.status(500);
        return { message: 'Não foi possível recuperar os clientes'};
      }
    },
  })(req,res,next);
});


route.get("/manager/:cpf/clients", (req: Request, res: Response, next: NextFunction) => {
	httpProxy(process.env.PROXY_CONTA_URL + '', {
    userResDecorator: (proxyRes:any, proxyResData:any, userReq:any, userRes:any): any => {
      if (proxyRes.statusCode === 200) {
				const str = Buffer.from(proxyResData).toString('utf-8');
				var clientes:any = [];
        JSON.parse(str).array.forEach((c: { cpf: any; name: any; balance: any; }) => {
					var cliente = {
							cpf : c.cpf,
							nome : c.name,
							saldo : c.balance,
					};
					clientes.push(cliente);
				});;
        userRes.status(200);
        return { clientes };
      } else {
        userRes.status(500);
        return { message: 'Não foi possível recuperar os clientes'};
      }
    },
  })(req,res,next);
});

route.get("/manager/:cpf/topFiveClients", (req: Request, res: Response, next: NextFunction) => {
	httpProxy(process.env.PROXY_CONTA_URL + '', {
    userResDecorator: (proxyRes:any, proxyResData:any, userReq:any, userRes:any): any => {
      if (proxyRes.statusCode === 200) {
				const str = Buffer.from(proxyResData).toString('utf-8');
				var clientes:any = [];
        JSON.parse(str).array.forEach((c: { cpf: any; name: any; balance: any; }) => {
					var cliente = {
							cpf : c.cpf,
							nome : c.name,
							saldo : c.balance,
					};
					clientes.push(cliente);
				});;
        userRes.status(200);
        return { clientes };
      } else {
        userRes.status(500);
        return { message: 'Não foi possível recuperar os clientes'};
      }
    },
  })(req,res,next);
});

route.get("/manager/:cpf/clientsBalance", (req: Request, res: Response, next: NextFunction) => {
	httpProxy(process.env.PROXY_CONTA_URL + '', {
    userResDecorator: (proxyRes:any, proxyResData:any, userReq:any, userRes:any): any => {
      if (proxyRes.statusCode === 200) {
				const str = Buffer.from(proxyResData).toString('utf-8');
        var objJson =JSON.parse(str);
				var saldoClients = {
						saldoPositivo : objJson.totalPositiveBalance,
						saldoNegativo : objJson.totalNegativeBalance,
				};
        userRes.status(200);
        return { saldoClients };
      } else {
        userRes.status(500);
        return { message: 'Não foi possível recuperar os clientes'};
      }
    },
  })(req,res,next);
});

route.post("/transaction/deposit", (req: Request, res: Response, next: NextFunction) => {
	httpProxy(process.env.PROXY_CONTA_URL + '', {
		proxyReqBodyDecorator(bodyContent, srcReq) {
			var retBody = {
				accountId : bodyContent.contaId,
				amount : bodyContent.valor
			};
      bodyContent = retBody;
			return bodyContent;
		},
    userResDecorator: (proxyRes:any, proxyResData:any, userReq:any, userRes:any): any => {
      if (proxyRes.statusCode === 200) {
        userRes.status(200);
        return { message : "Realizado com sucesso!" };
      } else {
        userRes.status(500);
        return { message: 'Não foi possível depositar'};
      }
    },
  })(req,res,next);
});

route.post("/transaction/withdraw", (req: Request, res: Response, next: NextFunction) => {
	httpProxy(process.env.PROXY_CONTA_URL + '', {
		proxyReqBodyDecorator(bodyContent, srcReq) {
			var retBody = {
				accountId : bodyContent.contaId,
				amount : bodyContent.valor
			};
      bodyContent = retBody;
			return bodyContent;
		},
    userResDecorator: (proxyRes:any, proxyResData:any, userReq:any, userRes:any): any => {
      if (proxyRes.statusCode === 200) {
        userRes.status(200);
        return { message : "Realizado com sucesso!" };
      } else {
        userRes.status(500);
        return { message: 'Não foi possível sacar'};
      }
    },
  })(req,res,next);
});
//FIM CONTA
route.post("/transaction/transfer", (req: Request, res: Response, next: NextFunction) => {
	httpProxy(process.env.PROXY_CONTA_URL + '', {
		proxyReqBodyDecorator(bodyContent, srcReq) {
			var retBody = {
				accountId : bodyContent.contaId,
				amount : bodyContent.valor,
				destinationAccountId : bodyContent.contaDestino
			};
      bodyContent = retBody;
			return bodyContent;
		},
    userResDecorator: (proxyRes:any, proxyResData:any, userReq:any, userRes:any): any => {
      if (proxyRes.statusCode === 200) {
        userRes.status(200);
        return { message : "Realizado com sucesso!" };
      } else {
        userRes.status(500);
        return { message: 'Não foi possível recuperar os clientes'};
      }
    },
  })(req,res,next);
});



app.listen(process.env.PORT, () => {
    console.log(
        `${new Date().toISOString()} ~[INFO] Servidor escutando na porta ${process.env.PORT}. http://localhost:${process.env.PORT}/`
    );
});
