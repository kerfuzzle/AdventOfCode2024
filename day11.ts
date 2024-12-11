import { readInput } from './utils';

function addStones(map: Map<number, number>, stone: number, amount: number) {
	const currentAmount = map.get(stone);
	if (currentAmount) map.set(stone, currentAmount + amount);
	else map.set(stone, amount);
}

function doBlink(stones: Map<number, number>) {
	const newMap = new Map<number, number>();
	for (const [current, value] of stones) {
		if (current === 0) addStones(newMap, 1, value);
		else {
			const digits = (Math.trunc(Math.log10(current)) + 1);
			if (digits % 2 === 0) {
				const power = (10 ** (digits / 2));
				const second = current % power;
				const first = (current - second) / power;
				addStones(newMap, first, value);
				addStones(newMap, second, value);
			}
			else addStones(newMap, current * 2024, value);
		}
	}
	return newMap;
}

function doBlinks(stones: Map<number, number>, amount: number) {
	let stoneCounts = stones;
	for (let i = 0; i < amount; i++) stoneCounts = doBlink(stoneCounts);
	return stoneCounts.values().reduce((acc, cv) => acc + cv, 0);
}

const stoneCounts = new Map<number, number>(readInput(11)[0].split(' ').map(num => [parseInt(num), 1]));
const start = performance.now();
console.log(`Part 1: ${doBlinks(stoneCounts, 25)}\nPart 2: ${doBlinks(stoneCounts, 75)}\nPerformance: ${Math.round(performance.now() - start)}ms`);
