const express = require('express')
const app = express()
const allRoutes = require('./routes/home')

const PORT = 3000
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files from public directory
app.use(express.static('public'));
app.use('/',allRoutes);

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))




