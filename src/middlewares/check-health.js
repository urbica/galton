export default path => async (ctx, next) => {
  if (ctx.path === path) {
    /* eslint-disable no-param-reassign */
    ctx.body = {
      timestamp: Date.now(),
      uptime: process.uptime()
    };
    /* eslint-enable no-param-reassign */
  } else {
    await next();
  }
};
