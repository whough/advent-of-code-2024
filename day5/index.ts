import * as fs from 'fs';

let orginalInput: any = fs.readFileSync('./inputs/day5', { encoding: 'utf8', flag: 'r' }); // Read the input file
const [input1, input2] = orginalInput.split(/[\r\n]{3,}/);

interface PageOrderRule {
    earlyPage: number;
    laterPage: number;
}

const pageOrderRules: [PageOrderRule] = input1.split(/[\r\n]+/).map((line: string) => line.split('|').reduce((obj: PageOrderRule, value, index) => {
    switch (index) {
        case 0:
            obj.earlyPage = parseInt(value);
            break;
        case 1:
            obj.laterPage = parseInt(value);
        default:
            break;
    }
    return obj;
}, {} as PageOrderRule)).sort((a: PageOrderRule, b: PageOrderRule) => (a.earlyPage !== b.earlyPage) ? a.earlyPage - b.earlyPage : a.laterPage - b.laterPage);

const pageUpdates: [number[]] = input2.split(/[\r\n]+/).map((line: string) => line.split(',').map(v => parseInt(v)));

const goodUpdates: [number[]?] = [];
const badUpdates: [number[]?] = [];

for (const pageUpdate of pageUpdates) {

    try {
        const doNotPrint: Set<number> = new Set();
        for (const pageNumber of pageUpdate) {
            if (doNotPrint.has(pageNumber)) { throw 'Printer Error'; }
            pageOrderRules.filter(r => r.laterPage === pageNumber).forEach(r => doNotPrint.add(r.earlyPage));
        }
        goodUpdates.push(pageUpdate);
    } catch (_) {
        badUpdates.push(pageUpdate);
    }
}

const reorderedUpdates = badUpdates.map(update => {
    // Create a graph of dependencies
    const dependencies: Map<number, Set<number>> = new Map();
    const pages = new Set(update);
    
    pages.forEach(page => {
        dependencies.set(page, new Set());
    });
    
    pageOrderRules.forEach(rule => {
        if (pages.has(rule.earlyPage) && pages.has(rule.laterPage)) {
            dependencies.get(rule.laterPage)?.add(rule.earlyPage);
        }
    });
    
    const result: number[] = [];
    const visited = new Set<number>();
    const temp = new Set<number>();
    
    function visit(page: number): boolean {
        if (temp.has(page)) return false;
        if (visited.has(page)) return true;
        
        temp.add(page);
        const deps = dependencies.get(page) || new Set();
        for (const dep of deps) {
            if (!visit(dep)) return false;
        }
        temp.delete(page);
        visited.add(page);
        result.unshift(page);
        return true;
    }
    
    let isValid = true;
    for (const page of pages) {
        if (!visited.has(page)) {
            if (!visit(page)) {
                isValid = false;
                break;
            }
        }
    }
    
    return isValid ? result : [];
});

const sumGoodMiddlePageNumbers = goodUpdates.map((pageUpdate) => pageUpdate![Math.floor(pageUpdate!.length/2)]).reduce((accumulator, currentValue) => accumulator += currentValue, 0);
console.log('Before reodering: ', sumGoodMiddlePageNumbers);

const sumReorderedMiddlePageNumbers = reorderedUpdates
    .filter(update => update.length > 0)
    .map(update => update[Math.floor(update.length/2)])
    .reduce((acc, curr) => acc + curr, 0);
console.log('After reodering: ', sumReorderedMiddlePageNumbers);