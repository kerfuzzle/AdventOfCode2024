import { readInput, splitArray, search2D, search2DIterator } from './utils';

type Vec2 = [number, number];

function getCoordinateInfront(currentPositon: Vec2, direction: string): Vec2 {
	if (direction === '^') return [currentPositon[0] - 1, currentPositon[1]];
	if (direction === '>') return [currentPositon[0], currentPositon[1] + 1];
	if (direction === 'v') return [currentPositon[0] + 1, currentPositon[1]];
	if (direction === '<') return [currentPositon[0], currentPositon[1] - 1];
	throw new Error('Invalid direction');
}

function testMove(grid: string[][], currentPositon: Vec2, direction: string) {
	const infront = getCoordinateInfront(currentPositon, direction);
	const cellInfront = grid[infront[0]][infront[1]];
	if (cellInfront === '#') return false;
	else if ((cellInfront === '[' || cellInfront === ']') && (direction === '^' || direction === 'v')) {
		const otherHalf: Vec2 = cellInfront === '[' ? [infront[0], infront[1] + 1] : [infront[0], infront[1] - 1];
		if (testMove(grid, otherHalf, direction) && testMove(grid, infront, direction)) return true;
	}
	else if (cellInfront === '.' || testMove(grid, infront, direction)) return true;
	return false;
}

function attemptMove(grid: string[][], currentPositon: Vec2, direction: string) {
	const infront = getCoordinateInfront(currentPositon, direction);
	const cellInfront = grid[infront[0]][infront[1]];
	if (cellInfront === '#') return false;
	else if ((cellInfront === '[' || cellInfront === ']') && (direction === '^' || direction === 'v')) {
		const otherHalf: Vec2 = cellInfront === '[' ? [infront[0], infront[1] + 1] : [infront[0], infront[1] - 1];
		if (testMove(grid, otherHalf, direction) && testMove(grid, infront, direction)) {
			attemptMove(grid, otherHalf, direction);
			attemptMove(grid, infront, direction);
			grid[infront[0]][infront[1]] = grid[currentPositon[0]][currentPositon[1]];
			grid[currentPositon[0]][currentPositon[1]] = '.';
			return true;
		};
	}
	else if (cellInfront === '.' || attemptMove(grid, infront, direction)) {
		grid[infront[0]][infront[1]] = grid[currentPositon[0]][currentPositon[1]];
		grid[currentPositon[0]][currentPositon[1]] = '.';
		return true;
	}
	return false;
}

function moveRobot(grid: string[][], robotPos: Vec2, direction: string) {
	const result = attemptMove(grid, robotPos, direction);
	if (result) return getCoordinateInfront(robotPos, direction);
	return robotPos;
}

function part1(gridString: string[], moves: string[]) {
	const grid = gridString.map(row => row.split(''));
	let robotPos: Vec2 = search2D(grid, '@');
	moves.forEach(move => robotPos = moveRobot(grid, robotPos, move));
	return search2DIterator(grid, e => e === 'O').reduce((acc, cv) => acc + 100 * cv.x + cv.y, 0);
}

function part2(gridString: string[], moves: string[]) {
	const expandedGrid = gridString.map(row => row.split('').reduce((acc, cv) => {
		if (cv === '#') acc.push('#', '#');
		if (cv === 'O') acc.push('[', ']');
		if (cv === '.') acc.push('.', '.');
		if (cv === '@') acc.push('@', '.');
		return acc;
	}, [] as string[]));
	let robotPos: Vec2 = search2D(expandedGrid, '@');
	moves.forEach(move => robotPos = moveRobot(expandedGrid, robotPos, move));
	return search2DIterator(expandedGrid, (e, i, j) => e === '[' && expandedGrid[i][j + 1] === ']').reduce((acc, cv) => acc + 100 * cv.x + cv.y, 0);
}
const sections = splitArray(readInput(15), '');
const moves = sections[1].join('').split('');
console.log(`Part 1: ${part1(sections[0], moves)}\nPart 2: ${part2(sections[0], moves)}`);
