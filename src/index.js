import express from 'express'
import { connectMongoDb } from '../libs/mongodb.js'
import { errorHandler } from '../middlewares/error.js';
import { notFound } from '../middlewares/notFound.js';
const app = express()
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('Hello Worldddd!')
})

app.use(express.json());
app.use(notFound);

app.use(errorHandler);
const startServer = async () => {
    await connectMongoDb();

    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
};

startServer();