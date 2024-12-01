import * as fs from 'fs';

export function readInput(day: number) {
	return fs.readFileSync(`./inputs/day${day}.txt`, 'utf-8').split('\n');
}

export function countOccurences<T>(array: T[], target: T) {
	return array.filter(element => element === target).length;
}
