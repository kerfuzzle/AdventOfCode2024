import { countOccurences, readInput } from './utils';

function getElement(grid: string[][], row: number, col: number) {
	if (row < 0 || row >= lines.length) return '';
	if (col < 0 || col >= lines[row].length) return '';
	return grid[row][col];
}

function getAdjacentStrings(grid: string[][], row: number, col: number, length: number) {
	const results = new Array<string>(8).fill(getElement(grid, row, col));
	for (let i = 1; i < length; i++) {
		results[0] += getElement(grid, row, col + i);
		results[1] += getElement(grid, row + i, col + i);
		results[2] += getElement(grid, row + i, col);
		results[3] += getElement(grid, row + i, col - i);
		results[4] += getElement(grid, row, col - i);
		results[5] += getElement(grid, row - i, col - i);
		results[6] += getElement(grid, row - i, col);
		results[7] += getElement(grid, row - i, col + i);
	}
	return results;
}

function part1(grid: string[][]) {
	return grid.reduce((acc1, row, i) => {
		return acc1 + row.reduce((acc2, cell, j) => {
			if (cell !== 'X') return acc2;
			const adj = getAdjacentStrings(grid, i, j, 4);
			return acc2 + countOccurences(adj, 'XMAS');
		}, 0);
	}, 0);
}

function part2(grid: string[][]) {
	return grid.reduce((acc, row, i) => {
		return acc + row.filter((cell, j) => {
			if (cell !== 'A') return false;
			const adj = getAdjacentStrings(grid, i, j, 2).filter((_, i) => i % 2 === 1);
			return adj[0] !== adj[2] && countOccurences(adj, 'AM') == 2 && countOccurences(adj, 'AS') == 2;
		}).length;
	}, 0);
}

const lines = readInput(4).map(line => line.split(''));
console.log(`Part 1: ${part1(lines)}\nPart 2: ${part2(lines)}`);
