import { createEmpty2D, readInput, search2D } from './utils';

interface Position {
	x: number;
	y: number;
}

enum Cell {
	EMPTY, BLOCKED, START,
}

enum Direction {
	NORTH, SOUTH, EAST, WEST,
}

function getCellInfront(grid: Cell[][], position: Position, direction: number) {
	if (direction === 0) return grid[position.x - 1]?.[position.y];
	else if (direction === 1) return grid[position.x]?.[position.y + 1];
	else if (direction === 2) return grid[position.x + 1]?.[position.y];
	else if (direction === 3) return grid[position.x]?.[position.y - 1];
}

function getPath(grid: Cell[][], startPosition: Position) {
	const visitedCells: Position[] = [];
	const mask = createEmpty2D<(Direction | undefined)>(grid.length, grid[0].length);
	const guardPosition = { x: startPosition.x, y: startPosition.y };
	let direction = Direction.NORTH;
	let withinGrid = true;
	while (withinGrid) {
		const cur = mask[guardPosition.x]?.[guardPosition.y];
		if (cur === direction) return undefined;
		else if (cur === undefined) {
			visitedCells.push({ x: guardPosition.x, y: guardPosition.y });
			mask[guardPosition.x][guardPosition.y] = direction;
		}

		const infront = getCellInfront(grid, guardPosition, direction);
		if (infront === undefined) withinGrid = false;
		else if (infront === Cell.BLOCKED) direction = (direction + 1) % 4;
		else {
			if (direction === Direction.NORTH) guardPosition.x -= 1;
			else if (direction === Direction.SOUTH) guardPosition.y += 1;
			else if (direction === Direction.EAST) guardPosition.x += 1;
			else if (direction === Direction.WEST) guardPosition.y -= 1;
		}
	}
	return visitedCells;
}

function part2(originalGrid: Cell[][], startPosition: Position) {
	const originalPath = getPath(originalGrid, startPosition)?.slice(1);
	return originalPath?.filter((newBlocker) => {
		originalGrid[newBlocker.x][newBlocker.y] = Cell.BLOCKED;
		const result = getPath(originalGrid, startPosition);
		originalGrid[newBlocker.x][newBlocker.y] = Cell.EMPTY;
		return result === undefined;
	}).length;
}

const grid = readInput(6).map(line => line.split('').map((char) => {
	if (char === '#') return Cell.BLOCKED;
	else if (char === '^') return Cell.START;
	else return Cell.EMPTY;
}));
const startPosition = search2D(grid, Cell.START);
const start = performance.now();
console.log(`Part 1: ${getPath(grid, { x: startPosition[0], y: startPosition[1] })?.length}`);
console.log(`Part 2: ${part2(grid, { x: startPosition[0], y: startPosition[1] })}`);
console.log(`Time: ${Math.round(performance.now() - start)}ms`);
