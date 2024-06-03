import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import debugImport from 'debug';
import http from 'http';
import indexRouter from './routes/index';
import onError from './utils/onError';
import normalizePort from './utils/normalizePort';
import onListening from './utils/onListening';
import cors from 'cors';

const debug = debugImport('dga-server-node:server');
const app = express();

const port = normalizePort(process.env.PORT ?? '3000');
app.set('port', port);

const server = http.createServer(app);

server.listen(port);
server.on('error', onError(port));
server.on('listening', onListening(server, debug));

const whitelist = ['http://localhost:3000', 'http://localhost:5173'];
app.use(
    cors({
        origin: function (origin: any, callback) {
            if (whitelist.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        optionsSuccessStatus: 200,
    })
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('static', express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter);

app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
});

app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default app;
