import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import DB from './db/connection'
import intializeVesion from './api'


const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

intializeVesion(app,'')

module.exports = app;
