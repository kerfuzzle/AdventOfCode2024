import * as fs from 'fs';

export function readInput(day: number) {
	return fs.readFileSync(`./inputs/day${day}.txt`, 'utf-8').split('\n');
}

export function splitArray<T>(arr: T[], delimiter: T): T[][] {
	const delimiterIndex = arr.indexOf(delimiter);
	if (delimiterIndex == -1) return [arr];
	return [arr.slice(0, delimiterIndex), ...splitArray(arr.slice(delimiterIndex + 1), delimiter)];
}

export function countOccurences<T>(array: T[], target: T) {
	return array.filter(element => element === target).length;
}

export function removeElements<T>(array: T[], index: number, amount = 1) {
	return array.slice(0, index).concat(array.slice(index + amount));
}

export function compareArray<T>(arr1: T[], arr2: T[]) {
	if (arr1.length !== arr2.length) return false;
	return arr1.every((_, i) => arr1[i] === arr2[i]);
}

export function getMiddleElement<T>(arr: T[]) {
	return arr[Math.floor(arr.length / 2)];
}

export function search2D<T>(grid: T[][], target: T): [number, number] {
	const row = grid.findIndex(row => row.includes(target));
	return [row, grid[row].indexOf(target)];
}

export function createEmpty2D<T>(rows: number, columns: number) {
	return Array(rows).fill(undefined).map(_ => Array<undefined>(columns)) as T[][];
}
