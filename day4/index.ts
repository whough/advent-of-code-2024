import * as fs from 'fs';

let orginalInput: any = fs.readFileSync('./inputs/day4', { encoding: 'utf8', flag: 'r' }); // Read the input file
const searchMatrix: [string[]] = orginalInput.split(/[\r\n]+/).map((line: string) => line.split('')); // Split by new lines

const isValid = (search: string) => (search === 'XMAS' || search === 'SAMX');
const isMas = (search: string) => (search === 'MAS' || search === 'SAM');

/*
    A B C D E F
    G H I J K L
    M N O P Q R
    S T U V W Z
*/

const searches: [string?] = [];
const searchesMas: [string[]?] = [];

for (let row = 0; row < searchMatrix.length; row++) {
    for (let column = 0; column < searchMatrix[row].length; column++) {
        try { // ABCD
            const search: string = searchMatrix[row][column] + searchMatrix[row][column + 1] + searchMatrix[row][column + 2] + searchMatrix[row][column + 3];
            searches.push(search);
        } catch (_) {}

        try { // AGMS
            const search: string = searchMatrix[row][column] + searchMatrix[row + 1][column] + searchMatrix[row + 2][column] + searchMatrix[row + 3][column];
            searches.push(search);
        } catch (_) {}

        try { // AHOV
            const search: string = searchMatrix[row][column] + searchMatrix[row + 1][column + 1] + searchMatrix[row + 2][column + 2] + searchMatrix[row + 3][column + 3];
            searches.push(search);
        } catch (_) {}

        try { // FKPU
            const search: string = searchMatrix[row][column] + searchMatrix[row + 1][column - 1] + searchMatrix[row + 2][column - 2] + searchMatrix[row + 3][column - 3];
            searches.push(search);
        } catch (_) {}

        
        try {
            // AHO
            const search1: string = searchMatrix[row][column] + searchMatrix[row + 1][column + 1] + searchMatrix[row + 2][column + 2];
            // MHC
            const search2: string = searchMatrix[row + 2][column] + searchMatrix[row + 1][column + 1] + searchMatrix[row][column + 2];
            searchesMas.push([search1, search2]);
        } catch (_) {}
    }
}

const xmas = searches.filter(search => isValid(search!));
console.log('XMAS: ' + xmas.length);

const x_mas = searchesMas.filter(searches => isMas(searches![0]) && isMas(searches![1]));
console.log('X-MAS: ' + x_mas.length);