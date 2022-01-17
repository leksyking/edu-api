require('dotenv').config()
require('express-async-errors')
const express = require('express')

//security packages
const helmet = require('helmet')
const xss = require('xss-clean')
const cors = require('cors')
const rateLimit = require('express-rate-limit')

//Swagger-ui-------
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = load('./swagger.yaml')
const YAML = require('yamljs')

const app = express()

//Error Handler MiddleWare
const notFound = require('./middleware/notFound')
const errorHandlerMiddleware = require('./middleware/errorhandler')
const authMiddleware = require('./middleware/authentication')

//Routers
const userRouter = require('./routes/user')
const docsRouter = require('./routes/docs')

//database
const connectDB = require('./db/docs')

app.use(express.json())

//security
app.set('trust proxy', 1)
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}))
app.use(helmet())
app.use(xss())
app.use(cors())

//Routes
app.get('/', (req, res)=>{
    res.send('WELCOME FELLAS <h1>Edu Api</h1> <a href="/api-docs"> Documentation </a>')
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/api/v1/auth', userRouter)
app.use('/api/v1/docs', authMiddleware, docsRouter)

//middlewares
app.use(notFound)
app.use(errorHandlerMiddleware)


const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => 
            console.log(`Started App on port ${port}`)
        )
    } catch (error) {
        console.log(error);   
    }
}
start();