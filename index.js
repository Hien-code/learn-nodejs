//Initialize and configure Expressv
const express = require("express");
const app = express();

//Load environment variables
require("dotenv").config();

//Connect to the database
const database = require("./config/database");
database.connect();

//Get the port from environment
const port = process.env.PORT;

//Get the port from environment
const route = require("./routes/client/index.route");

//Get the port admin from environment
const routeAdmin = require("./routes/admin/index.route");

//Configure the view engine
app.set("views", "./views");
app.set("view engine", "pug");

// Serve static assets
app.use(express.static("public"));

//Initialize client routes
route(app);
routeAdmin(app);

//Create Locals Variables
const systemConfig = require("./config/system");
app.locals.prefixAdmin = systemConfig.prefixAdmin;

//Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
