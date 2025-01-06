import mysql from "mysql2/promise";

const connectMysql = () => {
    try {
        const pool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DB,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        console.log("MySQL pool created successfully.");
        return pool;
    } catch (error) {
        console.error("MySQL connection error:", error);
        process.exit(1);
    }
};

export { connectMysql };
