import { createFilled2D, readInput } from './utils';

function findRegion(x: number, y: number, grid: string[][], target: string, currentRegion: [number, number][], testedCells: [number, number][]) {
	if (y < 0 || y > grid.length - 1 || x < 0 || x > grid[0].length - 1) return;
	if (testedCells.some(cell => cell[0] === x && cell[1] === y)) return;
	testedCells.push([x, y]);
	if (grid[y][x] === target) {
		if (!currentRegion.some(seen => seen[0] === x && seen[1] === y)) {
			currentRegion.push([x, y]);
		}
		findRegion(x + 1, y, grid, target, currentRegion, testedCells);
		findRegion(x, y + 1, grid, target, currentRegion, testedCells);
		findRegion(x, y - 1, grid, target, currentRegion, testedCells);
		findRegion(x - 1, y, grid, target, currentRegion, testedCells);
	}
	return currentRegion;
}

class Region {
	cells: [number, number][];
	name: string;
	constructor(cells: [number, number][], name: string) {
		this.cells = cells;
		this.name = name;
	}

	containsCell(cell: [number, number]) {
		return this.cells.some(e => e[0] === cell[0] && e[1] === cell[1]);
	}

	calculateArea() {
		return this.cells.length;
	}

	calculatePerimeter() {
		const max = Math.max.apply(undefined, this.cells.flat(1));
		const regionMap = createFilled2D(max + 1, max + 1, false);
		this.cells.forEach((shiftedCell) => {
			regionMap[shiftedCell[1]][shiftedCell[0]] = true;
		});
		let perimiter = regionMap.reduce((acc, row) => {
			return acc + (row[row.length - 1] ? 1 : 0) + row.reduce((acc, cell, i) => acc + ((i === 0 && cell) || (i !== 0 && cell !== row[i - 1]) ? 1 : 0), 0);
		}, 0);

		for (let i = 0; i < regionMap[0].length; i++) {
			let active = false;
			regionMap.forEach((row) => {
				if ((active === false && row[i] === true) || (active === true && row[i] === false)) perimiter++;
				active = row[i];
			});
			if (active) perimiter++;
		}
		return perimiter;
	}

	calculateSides() {
		const max = Math.max.apply(undefined, this.cells.flat(1));
		const regionMap = createFilled2D(max + 1, max + 1, false);
		this.cells.forEach((shiftedCell) => {
			regionMap[shiftedCell[1]][shiftedCell[0]] = true;
		});
		let active = false;
		let sides = 0;
		let previousIdx: [boolean, number][] = [];
		regionMap.forEach((row) => {
			const currentIdx: [boolean, number][] = [];
			active = false;
			row.forEach((cell, i) => {
				if ((active === false && cell === true) || (active === true && cell === false)) {
					if (!previousIdx.some(e => e[0] === active && e[1] === i)) sides++;
					currentIdx.push([active, i]);
				}
				active = cell;
			});
			if (active) {
				if (!previousIdx.some(e => e[0] === active && e[1] === row.length)) sides++;
				currentIdx.push([active, row.length]);
			}
			previousIdx = currentIdx;
		});

		previousIdx = [];
		for (let i = 0; i < regionMap[0].length; i++) {
			const currentIdx: [boolean, number][] = [];
			active = false;
			regionMap.forEach((row, j) => {
				if ((active === false && row[i] === true) || (active === true && row[i] === false)) {
					if (!previousIdx.some(e => e[0] === active && e[1] === j)) sides++;
					currentIdx.push([active, j]);
				}
				active = row[i];
			});
			if (active) {
				if (!previousIdx.some(e => e[0] === active && e[1] === regionMap.length)) sides++;
				currentIdx.push([active, regionMap.length]);
			};
			previousIdx = currentIdx;
		}
		return sides;
	}
}

const grid = readInput(12).map(line => line.split(''));
const regions: Region[] = [];
grid.forEach((row, i) => {
	row.forEach((cell, j) => {
		if (!regions.some(region => region.containsCell([j, i]))) {
			const regionCells = findRegion(j, i, grid, cell, [], [])!;
			regions.push(new Region(regionCells, cell));
		}
	});
});

const pt1 = regions.reduce((acc, cv) => acc + cv.calculateArea() * cv.calculatePerimeter(), 0);
const pt2 = regions.reduce((acc, cv) => acc + cv.calculateArea() * cv.calculateSides(), 0);
console.log(`Part 1: ${pt1}\nPart 2: ${pt2}`);
