import { Account, Client } from "appwrite";

const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // ✅ Correct
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); // ✅ Correct

export const account = new Account(client);
export default client;
