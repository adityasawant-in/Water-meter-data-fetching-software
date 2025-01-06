import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { connectMysql } from "./database.js";

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const pool = connectMysql(); // Create the MySQL pool here


// API endpoint for querying data by date range
app.post("/api/data", async (req, res) => {
    const { client, fromDate, toDate } = req.body;

    // Log the incoming request payload for debugging purposes
    console.log("Request payload:", { client, fromDate, toDate });

    // Input validation for required fields
    if (!client || !fromDate || !toDate) {
        return res.status(400).json({ message: "Client, fromDate, and toDate are required." });
    }

    // Format the dates to match the MySQL datetime format (YYYY-MM-DD HH:mm:ss)
    const formattedFromDate = fromDate.replace("T", " ") + ":00";  // Adding seconds
    const formattedToDate = toDate.replace("T", " ") + ":00";      // Adding seconds

    // Log the formatted dates for verification
    // console.log("Formatted Dates:", { formattedFromDate, formattedToDate });

    try {
        const query = `
            SELECT * FROM test_esp.waterSensorData 
            WHERE client = ? 
            AND dtime BETWEEN ? AND ?
            ORDER BY id DESC LIMIT 86400;
        `;
        // Log the query and values before executing
        // console.log("Executing query:", query, [client, formattedFromDate, formattedToDate]);

        // Query the database with the formatted dates
        const [rows] = await pool.query(query, [client, formattedFromDate, formattedToDate]);

        // Log the results from the database
        // console.log("Query results:", rows);

        // Return the query result as JSON
        res.json({ data: rows });
    } catch (error) {
        console.error("Error querying data:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});


// Start the server
app.listen(process.env.PORT || 9004,process.env.Host, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
