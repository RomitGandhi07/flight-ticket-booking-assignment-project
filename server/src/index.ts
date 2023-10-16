import app from "./app";
import { connectDatabase } from "./lib/database-manager";
import dotenv from 'dotenv';

const main = async () => {
    // Load environment variables
    dotenv.config();

    // Connect to database
    await connectDatabase("airway");
};

main().then(() => {
    app.listen("7777", () => {
        console.info("Server is running on the port 7777");
    });
}).catch(err => {
    console.error(err);
})
