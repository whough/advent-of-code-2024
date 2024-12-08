import * as fs from 'fs';

enum Direction {
    UP = '^',
    RIGHT = '>',
    DOWN = 'v',
    LEFT = '<'
}

interface Position {
    x: number;
    y: number;
    type: string;
}

interface Player extends Position {
    direction: Direction;
}

let orginalInput: any = fs.readFileSync('./inputs/day6', { encoding: 'utf8', flag: 'r' });
const lines = orginalInput.split(/[\r\n]+/);

// Store galaxies in a Set for O(1) lookup
const galaxyPositions = new Set<string>();
let height = lines.length;
let width = lines[0].length;
let initialPlayer: Player | undefined;

// Parse the map more efficiently
for (let y = 0; y < lines.length; y++) {
    const line = lines[y];
    for (let x = 0; x < line.length; x++) {
        if (line[x] === '#') {
            galaxyPositions.add(`${x},${y}`);
        } else if (line[x] === '^' || line[x] === '>' || line[x] === 'v' || line[x] === '<') {
            initialPlayer = { x, y, type: line[x], direction: line[x] as Direction };
        }
    }
}

// Find player position and direction
const findPlayer = (): Player | undefined => {
    return initialPlayer;
};

// Get next position based on current direction
const getNextPosition = (player: Player): Position => {
    const { x, y, direction } = player;
    switch (direction) {
        case Direction.UP:    return { x, y: y - 1, type: direction };
        case Direction.RIGHT: return { x: x + 1, y, type: direction };
        case Direction.DOWN:  return { x, y: y + 1, type: direction };
        case Direction.LEFT:  return { x: x - 1, y, type: direction };
    }
};

// Turn player 90 degrees clockwise
const turnClockwise = (player: Player): Player => {
    const directionOrder = [Direction.UP, Direction.RIGHT, Direction.DOWN, Direction.LEFT];
    const currentIndex = directionOrder.indexOf(player.direction);
    const newDirection = directionOrder[(currentIndex + 1) % 4];
    return { ...player, direction: newDirection, type: newDirection };
};

// Optimize position checking
const isValidPosition = (pos: Position): boolean => {
    if (pos.x < 0 || pos.x >= width || pos.y < 0 || pos.y >= height) {
        return false;
    }
    return !galaxyPositions.has(`${pos.x},${pos.y}`);
};

// Track visited positions with a Set instead of array
const visitedPositions = new Set<string>();

// Optimize moveUntilBlocked
const moveUntilBlocked = (player: Player): { newPosition: Player | null, steps: number } => {
    let currentPos = { ...player };
    let nextPos = getNextPosition(currentPos);
    let stepCount = 1;
    
    // Mark starting position
    visitedPositions.add(`${currentPos.x},${currentPos.y}`);
    
    // Check if next position is out of bounds (not just invalid)
    if (nextPos.x < 0 || nextPos.x >= width || nextPos.y < 0 || nextPos.y >= height) {
        return { newPosition: null, steps: stepCount };
    }
    
    while (isValidPosition(nextPos)) {
        currentPos = { ...nextPos, direction: player.direction };
        visitedPositions.add(`${currentPos.x},${currentPos.y}`);
        nextPos = getNextPosition(currentPos);
        stepCount++;
    }
    
    // Check if we stopped because of out-of-bounds
    if (nextPos.x < 0 || nextPos.x >= width || nextPos.y < 0 || nextPos.y >= height) {
        return { newPosition: null, steps: stepCount };
    }
    
    return { newPosition: currentPos, steps: stepCount };
};

// Add map printing back
const printMap = (currentPlayer: Player) => {
    let mapString = '';
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (currentPlayer.x === x && currentPlayer.y === y) {
                mapString += currentPlayer.direction;
            } else if (originalGalaxies.has(`${x},${y}`)) {
                mapString += '#';
            } else if (galaxyPositions.has(`${x},${y}`)) {
                mapString += 'O';
            } else {
                mapString += visitedPositions.has(`${x},${y}`) ? 'X' : '.';
            }
        }
        mapString += '\n';
    }
    console.log(mapString);
};

const MAX_MOVES = 400;// Function to detect if we've returned to start in same direction
const isLoop = (player: Player, startPlayer: Player): boolean => {
    const samePosition = player.x === startPlayer.x && player.y === startPlayer.y;
    const sameDirection = player.direction === startPlayer.direction;
    
    if (samePosition && sameDirection) {
        //console.log(`Loop detected at (${player.x}, ${player.y}) facing ${player.direction}`);
    }
    return samePosition && sameDirection;
};

// Function to run simulation with an extra galaxy
const runSimulation = (extraGalaxy: Position, startPlayer: Player): { 
    isLoop: boolean, 
    moves: number, 
    visited: number 
} => {
    // Early optimization: if we've visited more than 2n² positions, 
    // we must have a loop (based on mathematical proof)
    const maxPossiblePath = 2 * width * height;
    
    visitedPositions.clear();
    galaxyPositions.add(`${extraGalaxy.x},${extraGalaxy.y}`);
    
    let currentPlayer = { ...startPlayer };
    let moveCount = 0;
    
    // Track position+direction combinations we've seen
    const seenStates = new Set<string>();
    
    while (currentPlayer && moveCount < maxPossiblePath) {  // Use theoretical maximum instead of arbitrary 100
        const currentState = `${currentPlayer.x},${currentPlayer.y},${currentPlayer.direction}`;
        
        if (seenStates.has(currentState)) {
            galaxyPositions.delete(`${extraGalaxy.x},${extraGalaxy.y}`);
            return { isLoop: true, moves: moveCount, visited: visitedPositions.size };
        }
        
        seenStates.add(currentState);
        
        const { newPosition, steps } = moveUntilBlocked(currentPlayer);
        
        if (!newPosition) {
            // If we hit a boundary and haven't found a loop,
            // and our path length is odd, we can't have a valid solution
            if (visitedPositions.size % 2 !== 0) {
                galaxyPositions.delete(`${extraGalaxy.x},${extraGalaxy.y}`);
                return { isLoop: false, moves: moveCount, visited: visitedPositions.size };
            }
            break;
        }
        
        currentPlayer = turnClockwise(newPosition);
        moveCount++;
    }
    
    galaxyPositions.delete(`${extraGalaxy.x},${extraGalaxy.y}`);
    return { isLoop: false, moves: moveCount, visited: visitedPositions.size };
};

// Store original galaxy positions
const originalGalaxies = new Set(galaxyPositions);

// Main testing loop with progress logging
let startPlayer = findPlayer();
if (startPlayer) {
    console.log('Testing all possible positions...');
    
    // Calculate initial visited positions
    visitedPositions.clear();
    let currentPlayer = { ...startPlayer };
    while (currentPlayer) {
        const { newPosition } = moveUntilBlocked(currentPlayer);
        if (!newPosition) break;
        currentPlayer = turnClockwise(newPosition);
    }
    console.log(`Initial positions visited (before adding galaxy): ${visitedPositions.size}`);
    
    let loopCount = 0;
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // Skip positions that already have galaxies
            if (originalGalaxies.has(`${x},${y}`)) {
                continue;
            }
            
            // Reset galaxies to original state
            galaxyPositions.clear();
            originalGalaxies.forEach(pos => galaxyPositions.add(pos));
            
            const testResult = runSimulation({ x, y, type: '#' }, startPlayer);
            
            if (testResult.isLoop) {
                loopCount++;
                //console.log(`\nFound loop at position (${x}, ${y}):`);
                //console.log(`Moves made: ${testResult.moves}`);
                //console.log(`Positions visited: ${testResult.visited}`);
                
                // Print final map state for this position
                galaxyPositions.add(`${x},${y}`);
                //printMap(startPlayer);
            }
        }
    }
    
    console.log(`\nTotal positions that created loops: ${loopCount}`);
}
