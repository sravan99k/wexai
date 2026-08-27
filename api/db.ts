import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.NEO4J_URI;
const user = process.env.NEO4J_USERNAME;
const password = process.env.NEO4J_PASSWORD;

if (!uri || !user || !password) {
  console.error("Missing Neo4j connection details in environment variables.");
  process.exit(1);
}

// Create a driver instance
export const driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
  maxConnectionPoolSize: 100, // Stay well within the 200 connection limit of the free tier
});

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
