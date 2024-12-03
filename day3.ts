import { readInput } from './utils';
const lines = readInput(3);

let sum = 0;
let strictSum = 0;
let active = true;
lines.forEach((line) => {
	const instructions = line.match(/(mul\((\d+),(\d+)\))|(do\(\))|(don't\(\))/g);
	instructions?.forEach((instruction) => {
		if (instruction === 'don\'t()') active = false;
		else if (instruction === 'do()') active = true;
		else {
			const inputs = instruction.matchAll(/(\d+),(\d+)/g).toArray()[0];
			const product = parseInt(inputs[1]) * parseInt(inputs[2]);
			sum += product;
			if (active) strictSum += product;
		}
	});
});

console.log(`Part 1: ${sum}\nPart 2: ${strictSum}`);
