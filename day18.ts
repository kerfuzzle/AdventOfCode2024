import { createFilled2D, readInput, PriorityQueue } from './utils';
type Vec2 = [number, number];

function getNeighbours(position: Vec2): Vec2[] {
	return [[position[0] + 1, position[1]], [position[0] - 1, position[1]], [position[0], position[1] + 1], [position[0], position[1] - 1]];
}

function findShortestPath(grid: number[][]) {
	const dist = createFilled2D(grid.length, grid.length, Infinity);
	dist[0][0] = 0;
	const queue = new PriorityQueue<[Vec2, number]>((a, b) => a[1] - b[1], [[0, 0], 0]);
	while (queue.length() > 0) {
		const current = queue.dequeue()!;
		const neighbours = getNeighbours(current[0]);
		neighbours.forEach((n) => {
			if (dist[n[0]]?.[n[1]] === undefined) return;
			if (grid[n[1]][n[0]] !== 0) return;
			const u = current[0];
			const newCost = dist[u[0]][u[1]] + 1;
			if (dist[n[0]][n[1]] > newCost) {
				dist[n[0]][n[1]] = newCost;
				queue.enqueue([n, newCost]);
			}
		});
	}
	return dist[grid.length - 1][grid.length - 1];
}

function part1(bytes: Vec2[], gridSize: number) {
	const grid = createFilled2D(gridSize, gridSize, 0);
	bytes.slice(0, 1024).forEach(b => grid[b[1]][b[0]]++);
	return findShortestPath(grid);
}

function part2(bytes: Vec2[], gridSize: number) {
	const grid = createFilled2D(gridSize, gridSize, 0);
	return bytes.find((b) => {
		grid[b[1]][b[0]]++;
		return findShortestPath(grid) === Infinity;
	});
}

const bytes: Vec2[] = readInput(18).map(line => line.split(',').map(num => parseInt(num)) as Vec2);
const gridSize = 71;
console.log(`Part 1: ${part1(bytes, gridSize)}\nPart 2: ${part2(bytes, gridSize)?.join(',')}`);
