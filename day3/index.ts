import * as fs from 'fs';

let orginalInput: any = fs.readFileSync('./inputs/day3', { encoding: 'utf8', flag: 'r' }); // Read the input file
const lines: [string] = orginalInput.split(/[\r\n]+/); // Split by new lines

let isDo: boolean = true;
let totalSum = 0;
let instructionSum = 0;

// Read the lines in order.
for (const line of lines) {
    const matches: RegExpStringIterator<RegExpExecArray> = line.matchAll(/(do\(\)|don't\(\)|mul\((\d+),(\d+)\))/g);//.map(mul => parseInt(mul[1], 10)*parseInt(mul[2], 10));

    // Read the matches in order.
    for (const match of matches) {
        if (match[0] === 'do()') { isDo = true; } // turn on parsing
        else if (match[0] === 'don\'t()') { isDo = false; } // turn off parsing
        else {
            const mul = parseInt(match[2], 10) * parseInt(match[3], 10);
            totalSum += mul; // always sum (part 1)
            instructionSum += (isDo) ? mul : 0; // conditional sum (part 2)
        }
    }
}

console.log('Total Sum: ' + totalSum);
console.log('Instruction Sum: ' + instructionSum);