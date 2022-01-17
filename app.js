require('dotenv').config()
require('express-async-errors')
const express = require('express')

const helmet = require('helmet')
// const xss = require('x')
const cors = require('cors')
const swagger = require('swagger-ui-express')
const yaml = require('yamljs')

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
app.use(helmet())
// app.use(xss())
app.use(cors())

//Routes
app.get('/', (req, res)=>{
    res.send("WELCOME FELLAS")
});

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