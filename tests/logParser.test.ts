import { LogParser } from '../src/parser';
import * as fs from 'fs';
import { spawnSync } from 'child_process';
// describe('LogParser', () => {
//   it('should parse logs and return errors', () => {
//     // Arrange
//     const logParser = new LogParser();
//     const sampleLogs = [
//       '2022-01-15T10:30:45.123Z - info - {"transactionId":"1234","details":"Service is started"}',
//       '2022-01-15T10:31:15.456Z - error - {"transactionId":"5678","details":"Error occurred","err":"Something went wrong"}',
//       // Add more sample logs as needed
//     ];

//     // Act
//     const errors = logParser.parseLogs(sampleLogs);

//     // Assert
//     expect(errors).toHaveLength(1);
//     expect(errors[0].loglevel).toBe('error');
//     expect(errors[0].transactionId).toBe('5678');
//     expect(errors[0].err).toBe('Something went wrong');
//     // Add more assertions as needed
//   });
// });;

describe('Integration Test', () => {
  it('should parse logs and generate errors.json', () => {
    // Arrange
    const inputFilePath = './app.log';
    const outputFilePath = './errors.json';
    const expectedResult = [
      {
        timestamp: 1628475171259,
        loglevel: 'error',
        transactionId: '9abc55b2-807b-4361-9dbe-aa88b1b2e978',
        err: 'Not found',
      },
      // Add more expected results as needed
    ];

    // Act
    const command = 'node';  // Assuming the Node.js executable is in your PATH
    const args = ['parser.js', '--input', inputFilePath, '--output', outputFilePath];
    const result = spawnSync(command, args);

    // Assert
    expect(result.error).toBeUndefined();
    expect(result.status).toBe(0);

    // Verify the content of errors.json
    const actualResult = JSON.parse(fs.readFileSync(outputFilePath, 'utf-8'));
    expect(actualResult).toEqual(expectedResult);
    // Add more assertions as needed
  });
});