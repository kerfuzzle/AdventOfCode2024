import { createEmpty2D, readInput, reduce2D, reduce2DToArray, search2DIterator } from './utils';
type Vec2 = [number, number];

function getNeighbours(position: Vec2): Vec2[] {
	return [[position[0] + 1, position[1]], [position[0] - 1, position[1]], [position[0], position[1] + 1], [position[0], position[1] - 1]];
}

function findTrack(grid: string[][], currentCell: Vec2, dist = 0, result = createEmpty2D<number>(grid.length, grid[0].length)) {
	result[currentCell[1]][currentCell[0]] = dist;
	const neighbours = getNeighbours(currentCell).filter(n => result[n[1]]?.[n[0]] === undefined && grid[n[1]][n[0]] !== '#');
	neighbours.forEach(n => findTrack(grid, n, dist + 1, result));
	return result;
}

function calculateSkips(track: number[][], start: Vec2, maxLength: number) {
	const startTime = track[start[1]][start[0]];
	return reduce2DToArray<number, number>(track, (acc, cell, y, x) => {
		const dist = Math.abs(x - start[0]) + Math.abs(y - start[1]);
		if (cell === undefined || dist > maxLength) return acc;
		const save = cell - startTime - dist;
		if (save > 0) acc.push(save);
		return acc;
	});
}

function findValidSkips(track: number[][], maxLength: number, minSave: number) {
	return reduce2D(track, (acc, _, y, x) => {
		const skips = calculateSkips(track, [x, y], maxLength).filter(s => s >= minSave);
		return acc + skips.length;
	});
}

const grid = readInput(20).map(row => row.split(''));
const start = search2DIterator(grid, e => e === 'S').next().value!;
const track = findTrack(grid, [start.y, start.x]);
console.log(`Part 1: ${findValidSkips(track, 2, 100)}\nPart 2: ${findValidSkips(track, 20, 100)}`);
