import { Env } from '../config/Env.ts'
import { Print } from '../utilities/Print.ts'
import { AbstractEnvironment } from './AbstractEnvironment.ts'
import express from 'express'
import { AuthRouter } from '../routes/AuthRoutes.ts'
import { UserRouter } from "../routes/UserRoutes.ts"
import { BookRouter } from "../routes/BookRoutes.ts";


export class DevelopmentEnvironment extends AbstractEnvironment {
  constructor() {
    const port = Env.port
    super(port, new Print())
  }

  public run = () => {
    const developmentServer = express()

    this.initializeDefaultMiddlewares(developmentServer)

    // developmentServer.use(UnauthRouter)
    developmentServer.use(AuthRouter)
    developmentServer.use(UserRouter)
    developmentServer.use(BookRouter)
    // developmentServer.use(DocsRouter)
    // developmentServer.use(RedirectorRouter)
    // developmentServer.use(AppRouter)
    // developmentServer.use(APIRouter)
    if (Env.local) {
    //   developmentServer.use(LocalRouter)
    }

    this.listen(developmentServer)
  }
}