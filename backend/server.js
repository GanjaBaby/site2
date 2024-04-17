const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8000;

//Serve static files from the public  directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/hello', (req, res) => {
    //The request header includes a key called "user-agent" that contains information about the client software used to make the request.
    res.send({ message: 'Hello World!' });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});