const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const convertRoutes = require('./routes/convertRoutes');
const mergeRoutes = require('./routes/mergeRoutes');
app.use('/api/convert', convertRoutes);
app.use('/api/merge', mergeRoutes);

module.exports = app;
