import { readInput, getMiddleElement, splitArray } from './utils';

function checkUpdateValid(update: number[], rules: number[][]) {
	return rules.every((rule) => {
		const index1 = update.indexOf(rule[0]);
		const index2 = update.indexOf(rule[1]);
		if (index1 < 0 || index2 < 0) return true;
		else return index1 < index2;
	});
}

function part1(updates: number[][], rules: number[][]) {
	return updates.filter(update => checkUpdateValid(update, rules)).reduce((acc, cv) => acc + getMiddleElement(cv), 0);
}

function part2(updates: number[][], rules: number[][]) {
	return updates.filter(update => !checkUpdateValid(update, rules)).map((incorrectlyOrdered) => {
		return incorrectlyOrdered.sort((a, b) => {
			const relevantRule = rules.find(rule => rule.includes(a) && rule.includes(b));
			if (!relevantRule) return 0;
			const index1 = incorrectlyOrdered.indexOf(relevantRule[0]);
			const index2 = incorrectlyOrdered.indexOf(relevantRule[1]);
			return index1 - index2;
		});
	}).reduce((acc, cv) => acc + getMiddleElement(cv), 0);
}

const sections = splitArray(readInput(5), '');
const rules = sections[0].map(rule => rule.split('|').map(num => parseInt(num)));
const updates = sections[1].map(update => update.split(',').map(num => parseInt(num)));
console.log(`Part 1: ${part1(updates, rules)}\nPart 2: ${part2(updates, rules)}`);
