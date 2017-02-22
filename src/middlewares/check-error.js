export default () => async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    process.stderr.write(`${(new Date()).toISOString()} ${error.message}\n`);
    process.stderr.write(error.stack);

    /* eslint-disable no-param-reassign */
    ctx.body = error.message;
    ctx.status = error.status || 500;
    /* eslint-enable no-param-reassign */
  }
};
