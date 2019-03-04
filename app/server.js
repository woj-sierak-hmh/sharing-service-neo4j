import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import koaBunyanLogger from 'koa-bunyan-logger';

import log from './utils/logger.js';

import routes from './routes/index.js';

const app = new Koa();
app.use(bodyParser());
app.use(koaBunyanLogger(log));
app.use(koaBunyanLogger.requestIdContext());
app.use(
  koaBunyanLogger.requestLogger({
    updateLogFields: fields => {
      fields.req = undefined;
      fields.res = undefined;
      fields.user_id = 'unspecified_user';
      // fields.client_version =
      //   this.request.get('X-Client-Version') || 'unspecified_client_version';
    },
  })
);

app.use(routes.routes());
// responds to OPTIONS requests
app.use(routes.allowedMethods());

export default app;
