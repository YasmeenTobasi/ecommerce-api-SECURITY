const { Pool } = require("pg");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_eNH75hryzTYK@ep-billowing-rice-b4sug2d7-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require";

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on("connect", () => {
  console.log("Database connected successfully to Neon!");
});

module.exports = pool;