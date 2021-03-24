const express = require("express");
const cors = require("cors");
const es6Renderer = require('express-es6-template-engine');
const path = require("path");
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.apiURL = "/api";
    this.serviceURL = "/";
    // Middlewares
    this.middlewares();
    //Rutas de la aplicación 
    this.routes();
    //
  }
  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static(path.resolve(__dirname, "../client/dist")));
    // view engine setup
    this.app.engine('html', es6Renderer);
    this.app.set('views', path.resolve(__dirname, '../client/dist'));
    this.app.set('view engine', 'html');
  }
  routes() {
    this.app.use(this.apiURL, require("./apiRoutes"));
    this.app.use((error, req, res, next) => {
      res.status(500).json({ message: error.message })
    })
    this.app.use(this.serviceURL, require("./serviceRoutes"));
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server Started with port : ${this.port}`);
    });
  }
}

/**
 * app.js 와 같은 역할
 */
const server = new Server();

server.listen();