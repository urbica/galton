const createSelectShell = require('select-shell');

const select = (options = [], selectShellOptions = {}) =>
  new Promise((resolve, reject) => {
    const selectShell = options
      .reduce(
        (acc, option, index) => acc.option(option, index),
        createSelectShell({
          pointerColor: 'green',
          multiSelect: false,
          ...selectShellOptions
        })
      )
      .list();

    selectShell.on('select', resolve);
    selectShell.on('cancel', reject);
  });

module.exports = { select };
