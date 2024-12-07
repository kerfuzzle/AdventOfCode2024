import { readInput } from '../utils';

type operator = (a: number, b: number) => number;
class Calibration {
	answer: number;
	inputs: number[];
	gaps: number;

	constructor(line: string) {
		this.answer = parseInt(line.split(': ')[0]);
		this.inputs = line.split(': ')[1].split(' ').map(input => parseInt(input));
		this.gaps = this.inputs.length - 1;
	}

	testOperatorCombinations(operators: operator[]) {
		for (let i = 0; i < Math.pow(operators.length, this.gaps); i++) {
			const combinations = i.toString(operators.length).padStart(this.gaps, '0');
			const total = this.inputs.reduce((acc, cv, j) => {
				return operators[parseInt(combinations[j - 1])](acc, cv);
			});
			if (total === this.answer) return true;
		}
		return false;
	}
}

function getValidTotal(calibrations: Calibration[], operators: operator[]) {
	const valid = calibrations.filter(calibration => calibration.testOperatorCombinations(operators));
	return valid.reduce((acc, cv) => acc + cv.answer, 0);
}

const calibrations = readInput(7).map(line => new Calibration(line));
const functions: operator[] = [(a: number, b: number) => a + b, (a: number, b: number) => a * b, (a: number, b: number) => parseInt(a.toString() + b.toString())];
console.log(`Part 1: ${getValidTotal(calibrations, functions.slice(0, -1))}`);
console.log(`Part 2: ${getValidTotal(calibrations, functions)}`);
