import express from 'express';
import cors from 'cors';
import router from "./routers/routers.js";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

app.listen(process.env.PORT || 5000, () => {
    console.log("Server running on port " + process.env.PORT);
});

// app.listen(5000, () => console.log('Listening port 5000'));