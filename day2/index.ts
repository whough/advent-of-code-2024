import * as fs from 'fs';

let orginalInput: any = fs.readFileSync('./inputs/day2', { encoding: 'utf8', flag: 'r' }); // Read the input file
const reactors: [number[]] = orginalInput.split(/[\r\n]+/).map((line: string) => line.split(/[\s]+/).map((l: string) => parseInt(l, 10)));

const unsafeReactors: [number[]?] = [];
const safeReactors: [number[]?] = [];

const isSafe = (reactor: number[]) => {
    let isIncreasing: boolean = false;
    let isEqual: boolean = false;
    let isDecreasing: boolean = false;

    for (const [idx, level] of reactor.entries()) {
        if (idx === 0) { continue; }
        const difference = reactor[idx-1]-level;

        if (difference < 0) { isIncreasing = true; }
        if (difference === 0) { isEqual = true; }
        if (difference > 0) { isDecreasing = true; }

        if (Math.abs(difference) > 3 || isEqual || (isIncreasing && isDecreasing)) {
            return false;
        }
    }
    return true;
}

// Create buckets of safe and unsafe reactor reports.
reactors.forEach(reactor => {
    if (isSafe(reactor)) {
        safeReactors.push(reactor);
    } else {
        unsafeReactors.push(reactor);
    }
})

console.log('Unsafe Count: ' + unsafeReactors.length);
console.log('Safe Count: ' + safeReactors.length);

// Of the unsafe reactors, test if any can be dampened safely.
const dampenedSafeReactors: [number[]?] = [];

if (unsafeReactors.length > 0) {
    unsafeReactors.forEach(reactor => {
        if (Array.isArray(reactor)) {
            for (let i = 0; i < reactor.length; i++) {
                // Remove the element at the looping index.
                const splicedArray = reactor.toSpliced(i, 1);
                // Test for safety without the removed level.
                if (isSafe(splicedArray)) {
                    dampenedSafeReactors.push(reactor);
                    return;
                }
            }
        }
    })
}

console.log('Dampened Safe Count: ' + dampenedSafeReactors.length);
console.log('Total Safe Count: ' + (safeReactors.length + dampenedSafeReactors.length));