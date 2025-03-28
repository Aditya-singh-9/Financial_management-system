
import { Client, Account, ID } from 'appwrite';

// Initialize Appwrite client
export const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite Endpoint
    .setProject('67dea6b3003494de23ae'); // Your project ID

// Initialize Appwrite account
export const account = new Account(client);

// Authentication Functions
export const AppwriteService = {
    // Create a new account
    createAccount: async (email: string, password: string, name: string) => {
        try {
            const response = await account.create(
                ID.unique(),
                email,
                password,
                name
            );
            
            if (response) {
                // Login immediately after successful sign up
                return await AppwriteService.login(email, password);
            }
            
            return response;
        } catch (error) {
            console.error('Appwrite service :: createAccount :: error', error);
            throw error;
        }
    },

    // Login
    login: async (email: string, password: string) => {
        try {
            return await account.createEmailSession(email, password);
        } catch (error) {
            console.error('Appwrite service :: login :: error', error);
            throw error;
        }
    },

    // Get currently logged in user
    getCurrentUser: async () => {
        try {
            return await account.get();
        } catch (error) {
            console.error('Appwrite service :: getCurrentUser :: error', error);
            return null;
        }
    },

    // Logout
    logout: async () => {
        try {
            return await account.deleteSession('current');
        } catch (error) {
            console.error('Appwrite service :: logout :: error', error);
            throw error;
        }
    }
};
