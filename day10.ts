import { readInput, reduce2D } from './utils';

function progressTrailhead(x: number, y: number, grid: number[][], target: number, strict: boolean, seenNines: [number, number][]): number {
	if (grid[y]?.[x] !== target) return 0;
	else if (grid[y][x] === 9) {
		if (strict) {
			if (seenNines.some(seen => seen[0] === x && seen[1] === y)) return 0;
			seenNines.push([x, y]);
		}
		return 1;
	}
	else return progressTrailhead(x + 1, y, grid, target + 1, strict, seenNines) + progressTrailhead(x, y + 1, grid, target + 1, strict, seenNines) + progressTrailhead(x - 1, y, grid, target + 1, strict, seenNines) + progressTrailhead(x, y - 1, grid, target + 1, strict, seenNines);
}

const grid = readInput(10).map(line => line.split('').map(num => parseInt(num)));
const startTime = performance.now();
const part1 = reduce2D(grid, (acc, _, i, j) => acc + progressTrailhead(j, i, grid, 0, true, []));
const part2 = reduce2D(grid, (acc, _, i, j) => acc + progressTrailhead(j, i, grid, 0, false, []));
console.log(`Part 1: ${part1}\nPart 2: ${part2}\nPerformance: ${Math.round(performance.now() - startTime)}ms`);
