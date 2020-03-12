const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const schema = require('./graphql/schema');
const rootValue = require('./graphql/resolvers');
const isAuth = require('./middleware/auth');

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Metthod', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    if (req.metthod === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(isAuth);

app.use('/graphql', graphqlHttp({
    schema,
    rootValue,
    graphiql: true
}));

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-y78lp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        const server = app.listen(process.env.PORT, () => {
            console.log(`The server is running on ${server.address().port} port`);
        });
    })
    .catch(err => {
        console.log(err);
    });
