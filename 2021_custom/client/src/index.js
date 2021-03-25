import React from 'react';
import ReactDOM from 'react-dom';
import './styles/reset.css';
import './styles/main.scss';
import App from './app.js';

const reactapp = document.createElement("div");
document.body.appendChild(reactapp);
ReactDOM.render(<App />, reactapp);