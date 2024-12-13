import { readInput, splitArray } from './utils';

type Matrix = [[number, number], [number, number]];
type Coordinate = [number, number];

function getDeterminant(matrix: Matrix) {
	return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
}

function getAdjugate(matrix: Matrix): Matrix {
	return [[matrix[1][1], -matrix[0][1]], [-matrix[1][0], matrix[0][0]]];
}

function multiplyMatrix(matrix: Matrix, coordinate: Coordinate) {
	return [matrix[0][0] * coordinate[0] + matrix[0][1] * coordinate[1], matrix[1][0] * coordinate[0] + matrix[1][1] * coordinate[1]];
}

function parseCoordinate(string: string): Coordinate {
	const matches = string.matchAll(/X(?:\+|=)(\d+).*Y(?:\+|=)(\d+)/g).toArray()[0];
	return [parseInt(matches[1]), parseInt(matches[2])];
}

class Machine {
	buttonA: Coordinate;
	buttonB: Coordinate;
	target: Coordinate;

	constructor(machineString: string[]) {
		[this.buttonA, this.buttonB, this.target] = machineString.map(p => parseCoordinate(p));
	}

	solve(max = Infinity, offset = 0) {
		const coeffMatrix: Matrix = [[this.buttonA[0], this.buttonB[0]], [this.buttonA[1], this.buttonB[1]]];
		const det = getDeterminant(coeffMatrix);
		const adj = getAdjugate(coeffMatrix);
		const mult = multiplyMatrix(adj, this.target.map(t => t + offset) as Coordinate);
		const result = mult.map(m => m / det);
		if (result[0] % 1 === 0 && result[1] % 1 === 0 && result[0] >= 0 && result[1] >= 0 && result[0] <= max && result[1] <= max) return result[0] * 3 + result[1];
		return 0;
	}
}

const machines = splitArray(readInput(13), '').map(machineString => new Machine(machineString));
const pt1 = machines.reduce((acc, machine) => acc + machine.solve(100, 0), 0);
const pt2 = machines.reduce((acc, machine) => acc + machine.solve(Infinity, 10 ** 13), 0);
console.log(`Part 1: ${pt1}\nPart 2: ${pt2}`);
