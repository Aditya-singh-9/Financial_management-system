require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { spawn } = require("child_process");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// ✅ Use Helmet for security (disable CSP for unrestricted access if needed)
app.use(helmet());

// ✅ Disable CSP restrictions (optional if needed)
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src *; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src *; img-src * data:; style-src * 'unsafe-inline'; font-src *;"
  );
  next();
});

// ✅ Allow All CORS Access
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow all methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow all common headers
    credentials: false, // No credential restrictions
  })
);

// ✅ Default Route to check server status
app.get("/", (req, res) => {
  res.send("✅ Server is running with unrestricted CORS 🚀");
});

// ✅ Function to execute Python scripts
const runPythonScript = (scriptPath, inputData, res) => {
  console.log(`🚀 Running Python script: ${scriptPath}`);
  console.log(`📦 Input Data: ${JSON.stringify(inputData)}`);

  const pythonProcess = spawn("python", [
    scriptPath,
    JSON.stringify(inputData),
  ]);
  let output = "";

  pythonProcess.stdout.on("data", (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`❌ Python Script Error: ${data.toString()}`);
    return res.status(500).json({ error: "Python script execution failed" });
  });

  pythonProcess.on("close", () => {
    try {
      console.log(`✅ Python Response: ${output.trim()}`);
      res.json(JSON.parse(output.trim()));
    } catch (error) {
      console.error(`❌ JSON Parsing Error: ${error}`);
      res.status(500).json({ error: "Invalid JSON output from Python" });
    }
  });
};

const mongoose = require("mongoose");

// MongoDB Atlas Connection URI
const MONGO_URI = "mongodb://aditya99:Singh99@cluster0-shard-00-00.qmu5y.mongodb.net:27017,cluster0-shard-00-01.qmu5y.mongodb.net:27017,cluster0-shard-00-02.qmu5y.mongodb.net:27017/?replicaSet=atlas-1hzj51-shard-0&ssl=true&authSource=admin";

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected Successfully"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// Define Schema
const UserSchema = new mongoose.Schema({
  userID: String, // Link with Appwrite User ID
  name: String,
  email: String,
  role: String, // "student", "teacher", "admin"
  department: String,
  phone: String
});

// Define Model
const User = mongoose.model("User", UserSchema);

// Function to Save User
async function saveUser(userID, name, email, role, department, phone) {
  try {
    const user = new User({ userID, name, email, role, department, phone });
    await user.save();
    console.log("✅ User saved successfully");
  } catch (error) {
    console.error("❌ Error saving user:", error);
  }
}

// API to Fetch User by ID
app.get("/api/user/:id", async (req, res) => {
  try {
    const user = await User.findOne({ userID: req.params.id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const mysql = require("mysql2");

// Create a connection pool (Better for handling multiple queries)
const db = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "Aditya#99",
  database: process.env.MYSQL_DATABASE || "erp_finance",
  port: process.env.MYSQL_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Convert db to use Promises
const dbPromise = db.promise();

// Function to insert transaction
const insertTransaction = async (studentID, amount, status, txHash) => {
  try {
    await dbPromise.query(
      "INSERT INTO fee_transactions (student_id, amount, payment_status, blockchain_tx_hash) VALUES (?, ?, ?, ?)",
      [studentID, amount, status, txHash]
    );
    console.log("✅ Transaction inserted successfully");
  } catch (error) {
    console.error("❌ Error inserting transaction:", error);
  }
};

// API to fetch transactions
app.get("/api/transactions/:studentID", async (req, res) => {
  try {
    const studentID = req.params.studentID;

    if (!studentID) {
      return res.status(400).json({ error: "Student ID is required" });
    }

    const [rows] = await dbPromise.query(
      "SELECT * FROM fee_transactions WHERE student_id = ?",
      [studentID]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("❌ Error fetching transactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const { Client, Account } = require("appwrite");

// Initialize Appwrite client
const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
    .setProject("67dea6b3003494de23ae"); // Your Project ID

const account = new Account(client);

// Function to log in a user
async function loginAndGetUser() {
    try {
        // Login with email & password
        await account.createEmailSession("your-email@example.com", "your-password");
        
        // Fetch user details after login
        const user = await account.get();
        console.log("✅ Appwrite connected:", user);
    } catch (error) {
        console.error("❌ Appwrite error:", error);
    }
}

loginAndGetUser();

app.post("/api/signup", async (req, res) => {
  const { email, password, name, role } = req.body;
  try {
      const user = await account.create("unique()", email, password, name);
      res.json({ success: true, user });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
      const session = await account.createEmailSession(email, password);
      res.json({ success: true, session });
  } catch (error) {
      res.status(401).json({ error: "Invalid credentials" });
  }
});

// ✅ Fee Prediction API
app.post("/api/predict_fee", (req, res) => {
  console.log("📩 Received Fee Prediction Request:", req.body);
  if (!req.body.studentDetails) {
    return res
      .status(400)
      .json({ error: "Missing studentDetails in request body" });
  }
  runPythonScript("./models/predict_fee.py", req.body.studentDetails, res);
});

// ✅ Budget Prediction API
app.post("/api/predict_budget", (req, res) => {
  console.log("📩 Received Budget Prediction Request:", req.body);
  if (!req.body.expenses) {
    return res.status(400).json({ error: "Missing expenses in request body" });
  }
  runPythonScript("./models/predict_budget.py", req.body.expenses, res);
});

// ✅ Financial Insights API
app.get("/api/financial_insights", (req, res) => {
  runPythonScript("./models/financial_insights.py", {}, res);
});

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(`❌ Server Error: ${err}`);
  res.status(500).json({ error: "Internal Server Error" });
});

// ✅ Start Server with Error Handling
app
  .listen(port, "0.0.0.0", () => {
    console.log(`✅ Server running on http://192.168.0.105:${port}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `❌ Port ${port} is already in use. Please use a different port.`
      );
    } else {
      console.error(`❌ Server error: ${err}`);
    }
  });

// ✅ Debugging: Log available routes
console.log("🔗 Available API Routes:");
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`- ${r.route.path}`);
  }
});``
