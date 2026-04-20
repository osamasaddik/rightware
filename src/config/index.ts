import dotenv from "dotenv";

// Load environment variables only once
if (process.env?.ENV_LOADED) {
  dotenv.config();
  process.env.ENV_LOADED = "true";
}

interface Config {
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  NODE_ENV: string;
}

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    console.error(`ERROR: Environment variable ${key} is required but not defined.`);
    process.exit(1);
  }
  return value;
};

export const config: Config = {
  PORT: parseInt(getEnv("PORT", "3000"), 10),
  MONGODB_URI: getEnv("MONGODB_URI"),
  JWT_SECRET: getEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "8h"),
  NODE_ENV: getEnv("NODE_ENV", "development"),
};

export default config;
