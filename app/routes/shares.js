import * as shares from '../db/queries/shares.js';

export const createShare = async (ctx, next) => {
  // TODO validation of params

  ctx.log.info('ctx.request.body:', ctx.request.body);
  const recipients = ctx.request.body.recipientRefIds;
  ctx.log.info('recipientRefIds:', recipients);

  try {
    const result = await shares.createShare({
      ...ctx.params,
      recipients: recipients || ['grzuby'],
    });
    ctx.log.info('--------------->', result.summary.statement.parameters);
    ctx.status = 202;
  } catch (err) {
    ctx.log.error(err);
    ctx.status = 500;
    ctx.body = 'Apparently something went wrong...' + err.code;
  }

  // on application exit:
  // driver.close();
};

export const getShares = async ctx => {
  ctx.log.info('params-->', ctx.params);
  try {
    const assets = await shares.getShares(ctx.params);
    ctx.status = 200;
    ctx.body = { assets };
  } catch (err) {
    ctx.log.error(err);
    ctx.status = 500;
    ctx.body = 'Apparently something went wrong...' + err.code;
  }
};
