const { Client, Account } = require("appwrite");

// Initialize Appwrite client
const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
    .setProject("67dea6b3003494de23ae"); // Replace with your Project ID

const account = new Account(client);

// Function to create a test user
async function createTestUser() {
    try {
        const user = await account.create("unique()", "singhsatty612@gmail.com", "Singh@123");
        console.log("✅ User created:", user);
    } catch (error) {
        console.error("❌ Error creating user:", error);
    }
}

// Call the function
createTestUser();
