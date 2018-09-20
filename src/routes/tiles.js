module.exports = async (ctx) => {
  const z = parseInt(ctx.params.z, 10);
  const x = parseInt(ctx.params.x, 10);
  const y = parseInt(ctx.params.y, 10);

  const tile = new Promise((resolve, reject) => {
    ctx.osrm.tile([x, y, z], (error, buffer) => {
      if (error) {
        reject(error);
      }
      resolve(buffer);
    });
  });

  try {
    const buffer = await tile;

    if (buffer.length === 0) {
      ctx.status = 204;
    }

    ctx.body = buffer;
  } catch (error) {
    ctx.status = 204;
    ctx.body = undefined;
  }
};
