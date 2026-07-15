import { load } from '@std/dotenv'
import is from '@zarco/isness'
import { throwlhos } from '../globals/Throwlhos.ts'

const name = Deno.env.get('ENV') ?? 'local';

export const EnvironmentName = {
	local: 'local',
	dev: 'dev',
	hml: 'hml',
	server: 'server',
	test: 'test'
} as const;

if (Deno.env.get('ENV') === undefined) {
	await load ({
		envPath: `.env.${name}`,
		examplePath: '.env.example',
		allowEmptyValues: false,
		export: true,
	})
}

export const EnvTypes = {
	local: 'local',
	hml: 'hml',
	dev: 'dev',
	server: 'server',
	developmentLike: 'developmentLike',
  productionLike: 'productionLike',
  test: 'test'
} as const;

type EnvType = keyof typeof EnvTypes;
type EnvObject<T> = { [key in EnvType]?: T } 

// principal classe de ambientação
export class Env {
	static get name() {
		return name;
	}

	static get port() {
		const port = Deno.env.get('PORT');
		if(!port) throw throwlhos.err_internalServerError('PORT não foi definida nas variáveis de ambiente!');
		const portNumber = Number(port);
		if(isNaN(portNumber)) throw throwlhos.err_internalServerError(`PORT inválida: ${port}`);
		
		return portNumber;	
	}

	static get dev() {
		return name === EnvironmentName.dev;
	}

	static get local() {
		return name === EnvironmentName.local;
	}

	static get isDevLike() {
		return this.local || this.dev;
	}

	static get isProductionLike() {
		return name === EnvironmentName.server;
	}

	static get isTest() {
        return name === EnvironmentName.test;
    }

	// variaveis db
	static get dbHost() {
		return Deno.env.get('DB_HOST');
	}

	static get dbName() {
		return Deno.env.get('DB_NAME');
	}

	static get dbUser() {
        // Se não encontrar no .env, devolve um usuário falso em vez de quebrar
        return Deno.env.get('DB_USER') || 'mock_user_test';
    }

    static getDatabasePasswordByUsername(databaseUsername: string): string {
        // Se a variável DATABASE_PASSWORD... estiver vazia, não lance o throw Error!
        const password = Deno.env.get(`DATABASE_PASSWORD_FOR_${databaseUsername}`);
        
        return password || 'mock_password_test'; 
    }

	static get mongodbMaxPoolSize(): number | null {
    const mongodbMaxPoolSize = Deno.env.get('MONGODB_MAX_POOL_SIZE')
    
		if (!mongodbMaxPoolSize) return null
    
		if (!is.number(mongodbMaxPoolSize)) {
      throw new Error(`Invalid MONGODB_MAX_POOL_SIZE: ${mongodbMaxPoolSize}`)
    }
    return Number(mongodbMaxPoolSize)
  }


	
	// variaveis do sistema de autenticação
	static get jwtSecret() {
    const secret = Deno.env.get('JWT_SECRET')
    if (!secret) {
      throw throwlhos.err_internalServerError('JWT_SECRET não foi encontrado nas variáveis env!')
    }
    return secret
  }

	static get jwtAuthAlgorithm() {
    return 'HS256'
  }

  static get jwtExpiresIn() {
    return '15m'
  }

  static get authAccessTokenExpiration() {
    return 900000
  }

  static get authRefreshTokenExpiration() {
		const refreshTokenExpiration = Number(Deno.env.get('AUTH_REFRESH_TOKEN_EXPIRATION'))
    
		if(!refreshTokenExpiration) {
			throw throwlhos.err_internalServerError('AUTH_REFRESH_TOKEN_EXPIRATION não encontrado.')
		}

		return refreshTokenExpiration
  }

  static get refreshTokenDays() {
    return Math.floor(this.authRefreshTokenExpiration / (1000 * 60 * 60 * 24))
  }
}

export const env = <T = string>(objectOfEnvs: EnvObject<T>): T | string => {
	const keys: EnvType[] = Object.keys(objectOfEnvs) as EnvType[];
	let result: T | null = null;

	keys.forEach((key) => {
		if (!result && key === name && objectOfEnvs[key]) {
			result = objectOfEnvs[key] as T;
		}
		if (!result && key === EnvTypes.developmentLike && Env.isDevLike) {
      result = objectOfEnvs[EnvTypes.developmentLike] as T
    }
    if (!result && key === EnvTypes.productionLike && Env.isProductionLike) {
      result = objectOfEnvs[EnvTypes.productionLike] as T
    }
	})

	return result ?? '';
}