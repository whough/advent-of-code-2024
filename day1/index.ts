import * as fs from 'fs';

let orginalInput: any = fs.readFileSync('./inputs/day1', { encoding: 'utf8', flag: 'r' }); // Read the input file
const lines: [string] = orginalInput.split(/[\r\n]+/); // Split by new lines

const leftArray: number[] = [];
const rightArray: number[] = [];

for (const line of lines) {
    const [left, right] = line.split(/[\s]+/);
    leftArray.push(parseInt(left, 10));
    rightArray.push(parseInt(right, 10));
}

// Sort the lists ascending
leftArray.sort((a, b) => a - b);
rightArray.sort((a, b) => a - b);

// Make sure we didn't miss an input.
if (leftArray.length !== rightArray.length) { throw 'Array lengths do not match. Something went wrong...'; }

let distance: number = 0;

// Loop each value and calculate the distance
leftArray.forEach((val, idx) => {
    // Add distance to counter.
    distance += Math.abs(val-rightArray[idx]);
});

console.log('Distance: ' + distance);

interface InstanceCount {
    [key: string]: number
}

const instanceCount: InstanceCount = {};

// Loop each value and track how many times each value appears in the array
rightArray.forEach((val) => {
    instanceCount[val] = (instanceCount[val] || 0) + 1;
});

let similarityScore: number = 0;

// Loop each value and calculate the Similarity Score
leftArray.forEach((val) => {
    const multiplier = (val in instanceCount) ? instanceCount[val] : 0;
    similarityScore += val * multiplier;
});

console.log('Similarity Score: ' + similarityScore);