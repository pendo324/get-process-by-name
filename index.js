const { exec } = require('child_process');
const parse = require('csv-parse');
const bytes = require('bytes');

/**
 * @typedef {Object} TaskListItem
 * @property {string} imageName - executable name (usually *.exe)
 * @property {number} pid - process id
 * @property {string} sessionName
 * @property {number} sessionNumber
 * @property {number} memUsage - memory consumption, in bytes
 * @property {string} status
 * @property {string} userName
 * @property {string} cpuTime - CPU time in the format HH:MM:SS, where MM and SS are between 0 and 59 and HH is any unsigned number
 * @property {string} windowTitle
 */

/**
 * Returns tasklist in a useful format
 * @param {string} executableName - the name of the executable to search for
 *
 * @returns {Promise<TaskListItem[]>} list of processes with imagenames that match executableName
 *
 */
const getProcessByName = (executableName) => {
  return new Promise((resolve, reject) => {
    exec(
      `cmd /c chcp 65001>nul && tasklist /fi "imagename eq ${executableName}" /v /fo csv`,
      (err, stdout) => {
        if (err) {
          return reject(err);
        }

        parse(
          stdout,
          {
            columns: [
              'imageName',
              'pid',
              'sessionName',
              'sessionNumber',
              'memUsage',
              'status',
              'userName',
              'cpuTime',
              'windowTitle'
            ],
            cast(value, context) {
              if (context.records !== 0) {
                if (context.column === 'memUsage') {
                  const fixed = `${value.replace(',', '')}B`;
                  const bs =
                    bytes(fixed, {
                      unitSeparator: ' '
                    }) / 1.024;
                  return bs;
                } else if (
                  context.column === 'windowTitle' &&
                  value === 'N/A'
                ) {
                  return null;
                } else if (
                  context.column === 'pid' ||
                  context.column === 'sessionNumber'
                ) {
                  return parseInt(value);
                }
              }
              return value;
            }
          },
          (err, output) => {
            if (err) {
              if (err.code === 'CSV_INVALID_RECORD_LENGTH_DONT_MATCH_COLUMNS') {
                // there probably isn't a process with the name specified
                return resolve([]);
              }
              return reject(err);
            }
            if (output.length <= 1) {
              return resolve([]);
            }
            resolve(output.slice(1));
          }
        );
      }
    );
  });
};

module.exports = {
  getProcessByName
};
