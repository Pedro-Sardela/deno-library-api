import { Env } from './config/Env.ts';
import { DevelopmentEnvironment } from './Environments/DevelopmentEnvironment.ts'
import { Print } from './utilities/Print.ts'

const server = async () => { 
  const print = new Print();

  try {
    print.success('Initializing configuration...');
    print.info(`Environment set to env.${Env.name}`);
    print.info(`Is Devlopment: ${Env.isDevLike}`);
    print.info(`Is Production: ${Env.isProductionLike}`);
    
    if (Env.isDevLike) {
      print.info('Starting development environment...');
      const devEnv = new DevelopmentEnvironment();
      devEnv.run();
    }
  } catch (error) {
    print.error('Failed to start server:');
    print.error(error as unknown as string);
    Deno.exit(1);
  }
};

await server();