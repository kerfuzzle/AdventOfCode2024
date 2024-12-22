import { arrayWindows, readInput } from './utils';
interface Delta { delta: number; price: number }

const mix = (a: bigint, b: bigint) => a ^ b;
const prune = (a: bigint) => a & ((1n << 24n) - 1n);
function findNextSecret(secret: bigint) {
	secret = mix(secret, secret << 6n);
	secret = prune(secret);
	secret = mix(secret, secret >> 5n);
	secret = prune(secret);
	secret = mix(secret, secret << 11n);
	return prune(secret);
}

function findNthSecret(secret: bigint, n: number) {
	for (let i = 0; i < n; i++) secret = findNextSecret(secret);
	return secret;
}

function findDeltas(secret: bigint, n: number) {
	const deltas: Delta[] = [];
	for (let i = 0; i < n; i++) {
		const next = findNextSecret(secret);
		deltas.push({ delta: Number(next % 10n) - Number(secret % 10n), price: Number(next % 10n) });
		secret = next;
	}
	return deltas;
}

function findSequences(deltas: Delta[]) {
	const map = new Map<number, number>();
	arrayWindows(deltas, 4).forEach((window) => {
		const sequenceId = window.reduce((acc, cv) => acc * 100 + (cv.delta + 10), 0);
		if (!map.has(sequenceId)) map.set(sequenceId, window.pop()!.price);
	});
	return map;
}

function part1(buyers: bigint[]) {
	return buyers.reduce((acc, cv) => acc + findNthSecret(cv, 2000), 0n);
}

function part2(buyers: bigint[]) {
	const buyerSequences = buyers.map(buyer => findSequences(findDeltas(buyer, 2000)));
	const allSequences = buyerSequences.reduce((acc, cv) => acc.union(new Set(cv.keys())), new Set<number>());
	return allSequences.values().reduce((best, s) => {
		const total = buyerSequences.reduce((acc, cv) => {
			const price = cv.get(s);
			if (price === undefined) return acc;
			return acc + price;
		}, 0);
		if (total > best) return total;
		return best;
	}, 0);
}

const buyers = readInput(22).map(num => BigInt(num));
console.log(`Part 1: ${part1(buyers)}\nPart 2: ${part2(buyers)}`);
