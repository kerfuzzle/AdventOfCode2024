import * as fs from 'fs';

export function readInput(day: number) {
	return fs.readFileSync(`./inputs/day${day}.txt`, 'utf-8').split('\n');
}

export function countOccurences<T>(array: T[], target: T) {
	return array.filter(element => element === target).length;
}

export function removeElements<T>(array: T[], index: number, amount = 1) {
	return array.slice(0, index).concat(array.slice(index + amount));
}
