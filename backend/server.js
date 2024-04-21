require('dotenv').config();
const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const fs = require('fs');
const mysqldump = require('mysqldump');
const jwt = require('jsonwebtoken');


const app = express();
const port = process.env.PORT || 8000;

//Set up ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const publicDirectory = path.join(__dirname, '/public');
app.use(express.static(publicDirectory));

//Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
// Parse JSON request body
app.use(express.json());

//Connect MySQL
const pool = mysql.createPool({
    host: 'mysql',
    user: 'root',
    password: 'password',
    database: 'ganjababydb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Function to create users table
function createUsersTable() {
    // Read the contents of user.sql file
    fs.readFile('/database/user.sql', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading user.sql:', err);
            return;
        }

        // Execute the SQL commands to create the table
        pool.query(data, (err, results) => {
            if (err) {
                console.error('Error creating users table:', err);
                return;
            }
            console.log('Users table created successfully');
        });
    });
}

// Call the function to create users table when the application starts
createUsersTable();


app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

// Endpoint to create user table
app.get('/user', (req, res) => {
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


app.post('/api/v1/login', (req, res) => {
    // Authenticate User
    const username = req.body.username
    const user = {name: username}

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken })
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});