require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT;
const connectDb = require('./src/database/db-config')
const cors = require('cors');


const register = require("./src/routes/register");
const login = require("./src/routes/login");
const orders = require("./src/routes/orders");
const stripe = require("./src/routes/stripe");
const productsRoute = require("./src/routes/products");
const errorMiddleware = require('./src/middlewares/error.middleware');

// middleware 
app.use(express.json());
app.use(cors());

app.use("/api/register", register);
app.use("/api/login", login, errorMiddleware);
app.use("/api/orders", orders);
app.use("/api/stripe", stripe);
app.use("/api/products", productsRoute);

app.get("/products", (req, res) => {
    res.send(products);
});

//-------------Database Connection & Server ----------------
connectDb.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    });
})