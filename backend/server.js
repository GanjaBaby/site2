const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const fs = require('fs');
const mysqldump = require('mysqldump');

const app = express();
const port = process.env.PORT || 8000;

//Connect MySQL
const pool = mysql.createPool({
    host: 'mysql',
    user: 'root',
    password: 'password',
    database: 'mydatabase',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Parse JSON request body
app.use(express.json());

//Serve static files from the public  directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/v1/hello', (req, res) => {
    //The request header includes a key called "user-agent" that contains information about the client software used to make the request.
    res.send({ message: 'Hello World!' });
});

// Endpoint to create user table
app.get('/api/v1/user', (req, res) => {
  // Read the SQL file
  fs.readFile(path.join(__dirname, '/database/user.sql'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading SQL file:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    // Execute the SQL query
    pool.query(data, (err, results) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json({ message: 'User table created successfully' });
    });
  });
});

app.post('/api/v1/create-user', (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({
            error: "Username, email and password are required"
        });   
    }
    pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password], (err, results) => {
        if (err) {
            console.error('Error creating user:', err);
            return res.status(500).json({
                error: 'Internal Server Error'
            });
        }
        res.status(201).json({
            message: 'User created successfully', userId: results.insertId
        });
    });
});


// Endpoint to generate and download SQL dump
app.get('/api/v1/backup-db', (req, res) => {
    const dumpPath = path.join(__dirname, 'database', 'backup.sql');
    // Generate SQL dump
    mysqldump({
        connection: {
            host: 'mysql',
            user: 'root',
            password: 'password',
            database: 'mydatabase'
        },
        dumpToFile: dumpPath
    })
    .then(() => {
        // Send the SQL dump file to the client
        res.download(dumpPath, 'backup.sql', (err) => {
            if (err) {
                console.error('Error sending SQL dump:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            // Delete the SQL dump file after sending
            fs.unlinkSync(dumpPath);
        });
    })
    .catch((err) => {
        console.error('Error generating SQL dump:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    });
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});