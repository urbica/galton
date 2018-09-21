const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '../assets/index.html');
const template = fs.readFileSync(templatePath);

module.exports = (ctx) => {
  ctx.type = 'html';
  ctx.body = template;
};
