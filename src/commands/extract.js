/* eslint-disable prefer-destructuring */

const fs = require('fs');
const ora = require('ora');
const path = require('path');
const { geocode, extractWithQuery, buildAreaQuery } = require('osm-extractor');
const { select } = require('./utils');

const extract = async (name, useBestMatch = false) => {
  const spinner = ora('Geocoding').start();

  const results = await geocode(name).catch((error) => {
    spinner.fail();
    throw error;
  });

  if (results.length < 1) {
    spinner.fail();
    throw new Error(`Nothing found for ${name}`);
  }

  let result;
  if (results.length === 1) {
    spinner.succeed();
    result = results[0];
  } else {
    spinner.succeed();
    if (useBestMatch) {
      result = results[0];
    } else {
      spinner.info(`Found ${results.length} results:`);
      const options = results.map(r => r.display_name);
      const selectedOptions = await select(options);
      result = results[selectedOptions[0].value];
    }
  }

  spinner.text = 'Extracting';
  spinner.start();

  const data = await extractWithQuery(buildAreaQuery(result)).catch((error) => {
    spinner.fail();
    throw error;
  });

  const extractPath = path.join(process.cwd(), `${name}.osm`);
  const writeStream = data.pipe(fs.createWriteStream(extractPath));

  return new Promise((resolve, reject) => {
    writeStream.on('close', () => {
      spinner.succeed(`Extracted into ${extractPath}`);
      resolve(extractPath);
    });
    writeStream.on('error', (error) => {
      spinner.fail(`Couldn't extract: ${error.message}`);
      reject(error);
    });
  });
};

module.exports = extract;
