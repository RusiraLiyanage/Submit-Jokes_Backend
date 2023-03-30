const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.set('strictQuery',false);
const PORT = 8070;

app.use(express.json())
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
// an api call to submit a new joke
app.post('/submit-joke', async (req,res) => {
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
app.get('/joke-types', async (req,res) => {
    const joke_types = await Jokes_model.find();
    var typesArray = new Array();
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