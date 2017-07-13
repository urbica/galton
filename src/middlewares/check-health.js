module.exports = path => async (ctx, next) => {
  if (ctx.path === path) {
    ctx.body = {
      timestamp: Date.now(),
      uptime: process.uptime()
    };
  } else {
    await next();
  }
};
