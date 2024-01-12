import * as fs from 'fs';
import { spawnSync } from 'child_process';

describe('Integration Test', () => {
  it('should parse logs and generate errors.json', () => {

    const inputFilePath = './app.log';
    const outputFilePath = './errors.json';
    const expectedResult = [
      {
        timestamp: 1628475171259,
        loglevel: 'error',
        transactionId: '9abc55b2-807b-4361-9dbe-aa88b1b2e978',
        err: 'Not found',
      }
    ];

    const command = 'node';  
    const args = ['parser.js', '--input', inputFilePath, '--output', outputFilePath];
    const result = spawnSync(command, args);

    expect(result.error).toBeUndefined();
    expect(result.status).toBe(0);

    const actualResult = JSON.parse(fs.readFileSync(outputFilePath, 'utf-8'));
    expect(actualResult).toEqual(expectedResult);
  });
});