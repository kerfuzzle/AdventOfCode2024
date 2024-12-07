import { readInput } from './utils';

function getValidLineTotal(lines: string[], operators: ((a: number, b: number) => number)[]) {
	return lines.map((line) => {
		const answer = parseInt(line.split(': ')[0]);
		const inputs = line.split(': ')[1].split(' ').map(input => parseInt(input));
		const gaps = inputs.length - 1;
		for (let i = 0; i < Math.pow(operators.length, gaps); i++) {
			const combinations = i.toString(operators.length).padStart(gaps, '0');
			const total = inputs.reduce((acc, cv, j) => {
				return operators[parseInt(combinations[j - 1])](acc, cv);
			});
			if (total === answer) return answer;
		}
		return 0;
	}).reduce((acc, cv) => acc + cv, 0);
}

const lines = readInput(7);
const functions = [(a: number, b: number) => a + b, (a: number, b: number) => a * b, (a: number, b: number) => parseInt(a.toString() + b.toString())];
console.log(`Part 1: ${getValidLineTotal(lines, functions.slice(0, -1))}`);
console.log(`Part 2: ${getValidLineTotal(lines, functions)}`);
