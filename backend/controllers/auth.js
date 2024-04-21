const mysql = require('mysql2')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


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

exports.register = (req, res) => {
    console.log(req.body)
    const { name, email, password, passwordConfirm } = req.body;

    pool.query('SELECT email FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.log(err);
        }
        if(results.length > 0 ) {
            return res.render('register', {
                message: 'User already exists!'
            });
        } else if( password !== passwordConfirm) {
            return res.render('register', {
                message: 'Passwords do not match!'
            });
        }
        let hashedPassword = await bcrypt.hash(req.body.password, 8);
        console.log(hashedPassword);

        pool.query('INSERT INTO users SET ?', {username: name, email: email, password: hashedPassword}, (err, results) => {
            if (err) {
                console.log(err);
            } else {
                return res.render('login', {
                    message: 'User registered successfully!'
                });
            }
        });
    });
}

// Login function
exports.login = (req, res) => {
    const { email, password } = req.body;

    pool.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Server error');
        }
        if (results.length === 0) {
            return res.render('login', {
                message: 'Invalid email or password'
            });
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.render('login', {
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign({ userId: user.id }, 'c59b903600ebbed36b4ac10fb20553ddc67632dde59ea1af459d5b895985476e89be1ed44c3637973748adce06d7af105ea3d5fb9bd0f054cb91242c6c00d9cc', {
            expiresIn: '1h' // Token expires in 1 hour
        });

        // You can store the token in a cookie or send it in the response
        res.cookie('token', token, { httpOnly: true });
        res.render('index', {
            message: 'Login successfully!'
        });
    });
}