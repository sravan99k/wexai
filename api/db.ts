import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.NEO4J_URI;
const user = process.env.NEO4J_USERNAME;
const password = process.env.NEO4J_PASSWORD;

if (!uri || !user || !password) {
  console.error("Missing Neo4j connection details in environment variables.");
}

// Create a driver instance, or a dummy if missing credentials so it doesn't crash the serverless boot
export const driver = (uri && user && password)
  ? neo4j.driver(uri, neo4j.auth.basic(user, password), { maxConnectionPoolSize: 100 })
  : { session: () => { throw new Error("Missing Neo4j credentials in environment variables"); } } as any;

// Helper to check connection
export const checkConnection = async () => {
  try {
    await driver.verifyConnectivity();
    console.log("✅ Successfully connected to CognoDB!");
    return true;
  } catch (error) {
    console.error("❌ Failed to connect to CognoDB:", error);
    return false;
  }
};
