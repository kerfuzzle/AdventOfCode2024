import { readInput, splitArray } from './utils';

function parseSchematic(schematic: string[]) {
	return schematic.reduce((acc, line, i) => {
		if (i === 0 || i === schematic.length - 1) return acc;
		return acc.map((e, j) => e + (line.charAt(j) === '#' ? 1 : 0));
	}, [0, 0, 0, 0, 0]);
}

function part1(locks: number[][], keys: number[][]) {
	return locks.reduce((total, lock) => {
		return total + keys.reduce((lockTotal, key) => {
			return lockTotal + (lock.every((l, i) => l + key[i] <= 5) ? 1 : 0);
		}, 0);
	}, 0);
}

const schematics = splitArray(readInput(25), '');
const locks: number[][] = [];
const keys: number[][] = [];
schematics.forEach((schematic) => {
	if (schematic[0].startsWith('#')) locks.push(parseSchematic(schematic));
	else keys.push(parseSchematic(schematic));
});

console.log(`❄ Part 1: ${part1(locks, keys)} ❄`);
