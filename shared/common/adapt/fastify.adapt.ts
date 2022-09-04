import { FastifyAdapter } from '@nestjs/platform-fastify';
import FastifyMultipart from '@fastify/multipart';
const app: FastifyAdapter = new FastifyAdapter({
  trustProxy: true,
});
export { app as fastifyApp };

app.register(FastifyMultipart, {
  limits: {
    fields: 10, // Max number of non-file fields
    fileSize: 1024 * 1024 * 6, // limit size 6M
    files: 5, // Max number of file fields
  },
});

// set locals
app.getInstance().decorateReply('locals', null);
app.getInstance().addHook('preHandler', (req, res: any, next) => {
  res.locals = {};
  res.locals.moment = require('moment');
  next();
});

app.getInstance().addHook('onRequest', (request, reply, done) => {
  // set undefined origin
  const origin = request.headers.origin;
  if (!origin) {
    request.headers.origin = request.headers.host;
  }

  // forbidden php

  const url = request.url;

  if (url.endsWith('.php')) {
    reply.raw.statusMessage = 'PHP是世界上最好的语言! 但我不配用它!';

    return reply.code(418).send();
  } else if (url.match(/\/(adminer|admin|wp-login)$/g)) {
    reply.raw.statusMessage = '哈哈，看看是谁在搞渗透！';
    return reply.code(200).send();
  }

  // skip favicon request
  if (url.match(/favicon.ico$/) || url.match(/manifest.json$/)) {
    return reply.code(204).send();
  }

  done();
});
