import { readInput } from '../utils';
import * as fs from 'fs';

function addStones(map: Map<number, bigint>, stone: number, amount: bigint) {
	const currentAmount = map.get(stone);
	if (currentAmount) map.set(stone, currentAmount + amount);
	else map.set(stone, amount);
}

function doBlink(stones: Map<number, bigint>) {
	const newMap = new Map<number, bigint>();
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

function doBlinks(stones: Map<number, bigint>, amount: number) {
	let stoneCounts = stones;
	for (let i = 0; i < amount; i++) {
		if (i % 10_000 === 0) console.log(i, stoneCounts.size);
		stoneCounts = doBlink(stoneCounts);
	}
	return stoneCounts.values().reduce((acc, cv) => acc + cv, BigInt(0));
}

const stoneCounts = new Map<number, bigint>(readInput(11)[0].split(' ').map(num => [parseInt(num), BigInt(1)]));
const start = performance.now();
const blinkAmount = 1_000_000;
fs.writeFileSync('out.txt', doBlinks(stoneCounts, blinkAmount).toString());
console.log(`Performance: ${Math.round(performance.now() - start)}ms`);
