import { memoize, readInput, splitArray } from './utils';

function countDesigns(design: string, towels: string[]) {
	const memoCount = memoize((design: string, currentLength: number): number => {
		if (design.length === 0) return 1;
		if (currentLength > design.length) return 0;
		const section = design.slice(0, currentLength);
		if (towels.includes(section)) return memoCount(design, currentLength + 1) + memoCount(design.slice(currentLength), 1);
		else return memoCount(design, currentLength + 1);
	});
	return memoCount(design, 1);
}

const sections = splitArray(readInput(19), '');
const results = sections[1].map(d => countDesigns(d, sections[0][0].split(', ')));
console.log(`Part 1: ${results.filter(d => d != 0).length}\nPart 2: ${results.reduce((acc, cv) => acc + cv)}`);
