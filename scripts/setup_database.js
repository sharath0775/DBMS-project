const mysql = require('mysql2/promise');
const fs = require('fs/promises');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'novacart_db',
};

async function setupDatabase() {
  let connection;
  try {
    // Connect without specifying a database to create it if it doesn't exist
    connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    console.log(`Attempting to create database: ${dbConfig.database}`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
    console.log(`Database '${dbConfig.database}' ensured to exist.`);

    await connection.end();

    // Reconnect with the database specified to run schema
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to the database for schema execution.');

    const schemaPath = path.resolve(__dirname, '../database/schema.sql');
    const schemaSQL = await fs.readFile(schemaPath, 'utf8');

    // Parse and execute SQL statements, handling DELIMITER for procedures
    let currentStatement = '';
    let inProcedure = false;
    const lines = schemaSQL.split('\n');
    const customDelimiter = '$$'; // Default custom delimiter from schema.sql

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (trimmedLine === `DELIMITER ${customDelimiter}`) {
        inProcedure = true;
        currentStatement = ''; // Reset for procedure body
        continue;
      } else if (trimmedLine === `DELIMITER ;` && inProcedure) {
        // End of procedure block, execute it
        if (currentStatement.trim() !== '') {
          await connection.query(currentStatement);
          console.log('Executed procedure block.');
        }
        currentStatement = '';
        inProcedure = false;
        continue;
      }

      if (inProcedure) {
        currentStatement += line + '\n';
      } else {
        currentStatement += line + '\n';
        if (trimmedLine.endsWith(';')) {
          if (currentStatement.trim() !== '') {
            await connection.query(currentStatement);
            console.log('Executed SQL statement.');
          }
          currentStatement = '';
        }
      }
    }

    // Execute any remaining statement outside of a procedure block
    if (currentStatement.trim() !== '') {
      await connection.query(currentStatement);
      console.log('Executed final SQL statement.');
    }

    console.log('Database schema executed successfully.');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
