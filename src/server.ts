import express from 'express'
import colors from 'colors'
import cors, { CorsOptions } from 'cors'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swagger'
import router from './router'
import db from './config/db'

// Conectar bd
export async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        // console.log(colors.blue('Conexión exitosa DB'))
    } catch (error) {
        console.log(error)
        console.log(colors.bgRed.white('Hubo un error al conectar a la BD'))
    }
}

connectDB()

// Instancia de express
const server = express()

const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        if(origin === process.env.FRONTEND_URL) {
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))

        }
    }
}

server.use(cors(corsOptions))

// Leer datos de formularios
server.use(express.json())

server.use(morgan('dev'))

server.use('/api/products', router)

// Docs 
server.use('/docs',swaggerUi.serve, swaggerUi.setup(swaggerSpec))

export default server
