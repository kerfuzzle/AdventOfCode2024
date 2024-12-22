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

export function *search2DIterator<T>(grid: T[][], predicate: (element: T, i: number, j: number) => boolean) {
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[i].length; j++) {
			if (predicate(grid[i][j], i, j)) yield { x: i, y: j, element: grid[i][j] };
		}
	}
}

export function createEmpty2D<T>(rows: number, columns: number) {
	return Array(rows).fill(undefined).map(_ => Array<undefined>(columns)) as T[][];
}

export function createFilled2D<T>(rows: number, columns: number, element: T) {
	return Array(rows).fill(undefined).map(_ => Array(columns).fill(element) as T[]);
}

export function reduce2D<T>(grid: T[][], callback: (acc: number, cell: T, row: number, column: number) => number) {
	return grid.reduce((acc1, row, i) => {
		return acc1 + row.reduce((acc2, cell, j) => callback(acc2, cell, i, j), 0);
	}, 0);
}

export function reduce2DToArray<T, S>(grid: T[][], callback: (acc: S[], cell: T, row: number, column: number) => S[]): S[] {
	return grid.reduce((acc1, row, i) => {
		return acc1.concat(row.reduce((acc2, cell, j) => callback(acc2, cell, i, j), [] as S[]));
	}, [] as S[]);
}

export function *arrayWindows<T>(array: T[], size: number) {
	for (let i = 0; i <= array.length - size; i++) {
		yield array.slice(i, i + size);
	}
}

export function memoize<Arguments extends unknown[], Result>(func: (...args: Arguments) => Result): (...args: Arguments) => Result {
	const resultMap = new Map<string, Result>();
	return (...args): Result => {
		const argsJSON = JSON.stringify(args);
		let result = resultMap.get(argsJSON);
		if (result) return result;
		result = func(...args);
		resultMap.set(argsJSON, result);
		return result;
	};
}

export class PriorityQueue<T> {
	queue: T[];
	sortingPredicate: (a: T, b: T) => number;

	constructor(predicate: (a: T, b: T) => number, ...elements: T[]) {
		this.sortingPredicate = predicate;
		this.queue = elements;
		this.queue.sort(this.sortingPredicate);
	}

	enqueue(element: T) {
		this.queue.push(element);
		this.queue.sort(this.sortingPredicate);
	}

	dequeue() {
		if (this.queue.length === 0) return undefined;
		return this.queue.shift();
	}

	length() {
		return this.queue.length;
	}
}
