import { readInput, search2DIterator } from './utils';

class Antenna {
	x: number;
	y: number;
	frequency: string;

	constructor(x: number, y: number, frequency: string) {
		this.x = x;
		this.y = y;
		this.frequency = frequency;
	}

	calculateDistance(x: number, y: number) {
		return Math.abs(x - this.x) + Math.abs(y - this.y);
	}

	calculateGradient(x: number, y: number) {
		return (y - this.y) / (x - this.x);
	}

	getInfo(i: number, j: number): Info {
		return { dist: this.calculateDistance(i, j), grad: this.calculateGradient(i, j), freq: this.frequency };
	}
}

interface Info { dist: number; grad: number; freq: string };

function part1Predicate(current: Info, previous: Info) {
	const distValid = (current.dist === previous.dist * 2 || current.dist * 2 === previous.dist);
	return distValid && current.grad === previous.grad && current.freq === previous.freq;
}

function part2Predicate(current: Info, previous: Info) {
	return current.freq === previous.freq && (current.dist === 0 || previous.dist === 0 || current.grad === previous.grad);
}

function findAntinodes(grid: string[][], antennae: Antenna[], validityPredicate: (current: Info, previous: Info) => boolean) {
	return search2DIterator(grid, (_, i, j) => {
		const seenValues: Info[] = [];
		for (const antenna of antennae) {
			const current = antenna.getInfo(i, j);
			const isAN = seenValues.some(seenValue => validityPredicate(current, seenValue));
			seenValues.push(current);
			if (isAN) return true;
		}
		return false;
	}).toArray();
}

const grid = readInput(8).map(line => line.split(''));
const antennaPositions = search2DIterator(grid, cell => cell !== '.').toArray();
const antennae = antennaPositions.map(cell => new Antenna(cell.x, cell.y, cell.element));
console.log(`Part 1: ${findAntinodes(grid, antennae, part1Predicate).length}`);
console.log(`Part 2: ${findAntinodes(grid, antennae, part2Predicate).length}`);
