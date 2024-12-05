const express = require('express')
const app = express()
const allRoutes = require('./routes/home')

const PORT = 3000
app.use(express.json());
app.use('/',allRoutes);

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))