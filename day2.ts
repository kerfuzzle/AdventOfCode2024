import { readInput, removeElements } from './utils';
const lines = readInput(2);
const records = lines.map(line => line.split(' ').map(reading => parseInt(reading)));

function checkIfSafe(record: number[]) {
	const isDecreasing = (record[1] - record[0]) < 0;
	for (let j = 1; j < record.length; j++) {
		const diff = record[j] - record[j - 1];
		if ((isDecreasing && (diff < -3 || diff > -1)) || (!isDecreasing && (diff > 3 || diff < 1))) {
			return false;
		}
	}
	return true;
}

function part1(records: number[][]) {
	return records.filter(record => checkIfSafe(record)).length;
}

function part2(records: number[][]) {
	return records.filter((record) => {
		if (checkIfSafe(record)) return true;
		return record.some((_, index) => checkIfSafe(removeElements(record, index, 1)));
	}).length;
}

console.log(`Part 1: ${part1(records)}\nPart 2: ${part2(records)}`);
