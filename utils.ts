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

export function compareArray<T>(arr1: T[], arr2: T[]) {
	if (arr1.length !== arr2.length) return false;
	return !arr1.some((_, i) => arr1[i] !== arr2[i]);
}
