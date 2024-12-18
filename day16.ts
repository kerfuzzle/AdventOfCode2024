import { createFilled2D, PriorityQueue, readInput, search2DIterator } from './utils';

enum Direction {
	NORTH, EAST, SOUTH, WEST,
}

class Node {
	x: number;
	y: number;
	isWall: boolean;
	isStart: boolean;
	isFinish: boolean;
	bestCosts = new Map<Direction, number>([[0, Infinity], [1, Infinity], [2, Infinity], [3, Infinity]]);
	bestPaths = new Map<Direction, Set<Node>>([[0, new Set()], [1, new Set()], [2, new Set()], [3, new Set()]]);

	constructor(x: number, y: number, isWall: boolean, isStart: boolean, isFinish: boolean) {
		this.x = x;
		this.y = y;
		this.isWall = isWall;
		this.isStart = isStart;
		this.isFinish = isFinish;
	}

	getAdjacent(grid: Node[][]) {
		return [{ node: grid[this.y + 1][this.x], dir: Direction.SOUTH }, { node: grid[this.y - 1][this.x], dir: Direction.NORTH }, { node: grid[this.y][this.x + 1], dir: Direction.EAST }, { node: grid[this.y][this.x - 1], dir: Direction.WEST }];
	}

	getNeighbours(grid: Node[][], direction: Direction) {
		return this.getAdjacent(grid).filter(e => !e.node.isWall).map((e) => {
			let cost = 1;
			if (direction === Direction.EAST) {
				if (e.dir === Direction.WEST) cost += 2000;
				else if (e.dir !== Direction.EAST) cost += 1000;
			}
			if (direction === Direction.WEST) {
				if (e.dir === Direction.EAST) cost += 2000;
				else if (e.dir !== Direction.WEST) cost += 1000;
			}
			if (direction === Direction.NORTH) {
				if (e.dir === Direction.SOUTH) cost += 2000;
				else if (e.dir !== Direction.NORTH) cost += 1000;
			}
			if (direction === Direction.SOUTH) {
				if (e.dir === Direction.NORTH) cost += 2000;
				else if (e.dir !== Direction.SOUTH) cost += 1000;
			}
			return { cost: cost, node: e.node, direction: e.dir };
		});
	}
}

function dijkstras(grid: Node[][]) {
	const start = search2DIterator(grid, e => e.isStart).toArray()[0].element;
	start.bestPaths.set(Direction.EAST, new Set([start]));
	const queue = new PriorityQueue<{ node: Node; dir: Direction; dist: number }>((a, b) => a.dist - b.dist);
	queue.enqueue({ node: start, dir: Direction.EAST, dist: 0 });
	while (queue.length() > 0) {
		const current = queue.dequeue()!;
		const neighbours = current.node.getNeighbours(grid, current.dir);
		neighbours.forEach((n) => {
			const newCost = current.dist + n.cost;
			if (n.node.bestCosts.get(n.direction)! >= newCost) {
				const currentPath = current.node.bestPaths.get(current.dir)!;
				const newPath = (n.node.bestCosts.get(n.direction) === newCost) ? n.node.bestPaths.get(n.direction)!.union(currentPath) : currentPath.union(new Set<Node>());
				newPath.add(n.node);
				n.node.bestPaths.set(n.direction, newPath);
				n.node.bestCosts.set(n.direction, newCost);
				queue.enqueue({ node: n.node, dir: n.direction, dist: newCost });
			}
		});
	}
	const end = search2DIterator(grid, e => e.isFinish).toArray()[0].element;
	return end;
}

function part1(grid: Node[][]) {
	const end = dijkstras(grid);
	return end.bestCosts.values().toArray().toSorted()[0];
}

function part2(grid: Node[][]) {
	const end = dijkstras(grid);
	const bestCosts = end.bestCosts.entries().toArray().sort((a, b) => a[1] - b[1]);
	const bestPathNodes = end.bestPaths.values().toArray()[bestCosts[0][0]];
	const pathGrid = createFilled2D(grid.length, grid.length, '.');
	bestPathNodes.forEach(b => pathGrid[b.y][b.x] = 'O');
	console.log(pathGrid.map(r => r.join('')).join('\n'));
	return bestPathNodes.size;
}

const grid = readInput(16).map((line, i) => {
	return line.split('').map((cell, j) => {
		return new Node(j, i, cell === '#', cell === 'S', cell === 'E');
	});
});

console.log(`Part 1: ${part1(grid)}\nPart 2: ${part2(grid)}`);
