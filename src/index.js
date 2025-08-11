import express from 'express'
import route from '../routes/routes.js';
import { connectMongoDb } from '../libs/mongodb.js'
import { errorHandler } from '../middlewares/error.js';
import { notFound } from '../middlewares/notFound.js';
const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.json());

route(app);
app.use(notFound);

app.use(errorHandler);

const startServer = async () => {
    await connectMongoDb();

    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
};

startServer();