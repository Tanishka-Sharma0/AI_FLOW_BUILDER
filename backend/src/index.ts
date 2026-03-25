import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import aiRoutes from './routes/aiRoutes';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

const allowedOrigins = process.env.FRONTEND_URL?.split(",") || [];
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("CORS not allowed"));
            }
        },
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString(), message: "Running Correct" });
});

//middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!',
    });
});


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Root check: http://localhost:${PORT}`);
    })
});