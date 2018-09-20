const ora = require('ora');
const { getProfileNames, extract, contract } = require('osrm-bindings');
const { select } = require('./utils');

// TODO: write logs into file
const build = async (extractPath, profile) => {
  const spinner = ora('Collecting profiles').start();
  const profileNames = await getProfileNames().catch((error) => {
    spinner.fail();
    throw error;
  });

  spinner.succeed();

  let profileName = profile;
  if (!profileName) {
    spinner.info(`Found ${profileNames.length} profiles:`);
    const [{ value }] = await select(profileNames);
    profileName = profileNames[value];
  }

  if (!profileNames.includes(profileName)) {
    throw new Error(`Couldn't find profile ${profileName}`);
  }

  spinner.text = `Extracting graph using ${profileName} profile`;
  spinner.start();

  const graphPath = await extract(extractPath, profileName).catch((error) => {
    spinner.fail(`Couldn't extract graph: ${error.message}`);
    throw error;
  });

  spinner.succeed();

  spinner.text = 'Contracting graph';
  spinner.start();

  await contract(graphPath).catch((error) => {
    spinner.fail(`Couldn't contract graph: ${error.message}`);
    throw error;
  });

  spinner.succeed(`Graph contracted into ${graphPath}`);

  return graphPath;
};

module.exports = build;
