import { Debugger } from 'debug';
import { IncomingMessage, Server, ServerResponse } from 'http';

/**
 * Event listener for HTTP server "listening" event.
 */
export default function onListening(
    server: Server<typeof IncomingMessage, typeof ServerResponse>,
    debug: Debugger
) {
    return () => {
        const addr = server.address();
        const bind =
            typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
        debug('Listening on ' + bind);
    };
}
