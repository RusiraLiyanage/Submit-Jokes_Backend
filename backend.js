const express = require('express');
const app = express();
const mongoose = require('mongoose');
// using Swagger documentation in this backend project.
const swaggerUI = require('swagger-ui-express');
var cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc');
mongoose.set('strictQuery',false);
const PORT = 8070;

app.use(express.json())
app.use(cors())
// configuring the cors policy - letting port 3000 requests to access
var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

//Swagger Options
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Submit Jokes μS",
            version: "1.0.0"
        }
    },
    apis: ['backend.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

/**
 * @swagger
 * /joke-types:
 *      get:
 *          joke-types: Get all the joke types
 *          responses:
 *              200:
 *                  description: Success
 */
// Mongo DB connection establishment and model initializations
const connectDB = async () => {
    mongoose.connect(
    "mongodb+srv://rusira:rusira123@cluster0.2ouhrwy.mongodb.net/Jokes?retryWrites=true&w=majority"
    ).then((responde) => {
        console.log(responde)
    });
    const jokesSchema = new mongoose.Schema({
        description: String,
        type: String
    });
    Jokes_model = mongoose.model("jokes",jokesSchema)
}

/**
 * @swagger
 * /submit-joke:
 *      post:
 *          description: Add a new Joke
 *          parameters:
 *          - name: description
 *            description: the Joke itself
 *            in: formData
 *            required: true
 *            type: string
 *          - name: type
 *            description: the type of the joke
 *            in: formData
 *            required: true
 *            type: string
 *          responses:
 *            201:
 *              description: Success
 */
// an api call to submit a new joke
app.post('/submit-joke', cors(corsOptions),async (req,res) => {
    const {description,type} = req.body;
    await Jokes_model.collection.insertOne({description: description,type: type})
    .then(result => {
        res.status(201).json(result)
    })
    .catch(error => {
        res.status(500).json({error: "Could not create the new joke"})
    })
});

// an api call to retrieve the joke types
app.get('/joke-types', cors(corsOptions), async (req,res) => {
    const joke_types = await Jokes_model.find();
    var typesArray = new Array();
    typesArray.push('');
    joke_types.forEach(element => {
        console.warn(element.type)
        if(!typesArray.includes(element.type)){
            typesArray.push(element.type)
        }
    });
    console.warn(joke_types)
    if(!joke_types){
        return res.json({status: "error", error: "Couldn't find joke types"});
    }
    return res.json({status: "ok", data: typesArray});
});

connectDB();

app.listen(
    PORT,
    () => console.log(`It's alive on http://localhost:${PORT}`)
)
