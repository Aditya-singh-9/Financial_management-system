const mysql = require("mysql");

// Create connection
const connection = mysql.createConnection({
    host: "localhost",    // Change to your MySQL host if needed
    user: "root",         // Your MySQL username
    password: "Aditya#99",         // Your MySQL password (if any)
    database: "testdb"    // Replace with your database name
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error("❌ MySQL connection failed:", err);
    } else {
        console.log("✅ MySQL Connected Successfully!");
    }
});

// Close connection
connection.end();
