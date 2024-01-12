import * as fs from 'fs';
import * as yargs from 'yargs';

interface LogEntry {
  timestamp: number;
  loglevel: string;
  transactionId: string;
  err: string;
}

export class LogParser {
  parseLogs(logs: string[]): LogEntry[] {
    const errorLogs: LogEntry[] = [];

    for (const log of logs) {
      const logParts = log.split(' - ');
      if (logParts.length >= 3) {
        const timestamp = logParts[0];
        const loglevel = logParts[1];
        const logDetails = logParts[2];

        try {
          const { transactionId, details, err } = JSON.parse(logDetails);
          if (err && loglevel == "error") {
            errorLogs.push({ timestamp: Date.parse(timestamp), loglevel: 'error', transactionId, err });
          }
        } catch (error) {
          // Log parsing error
          console.error('Error parsing log:', log, error);
        }
      }
    }

    return errorLogs;
  }
}

const argv = yargs
  .option('input', {
    alias: 'i',
    description: 'Path to the input log file',
    type: 'string',
    default: './app.log',
  })
  .option('output', {
    alias: 'o',
    description: 'Path to the output file',
    type: 'string',
    default: './errors.json',
  })
  .help()
  .alias('help', 'h').argv as any as { input: string; output: string };

if (require.main === module) {
  const inputFile = argv.input;
  const outputFile = argv.output;

  // Read logs from the input file
  const logs = fs.readFileSync(inputFile, 'utf-8').split('\n');

  // Remove empty entries
  const cleanedLogs = logs.filter((log) => log.trim().length > 0);

  // Initialize the LogParser
  const parser = new LogParser();

  // Parse the logs and filter error entries
  const errorLogs = parser.parseLogs(cleanedLogs);

  // Log error entries to the console
  console.log(JSON.stringify(errorLogs, null, 2));

  // Write error entries to the output file
  fs.writeFileSync(outputFile, JSON.stringify(errorLogs, null, 2));
}
