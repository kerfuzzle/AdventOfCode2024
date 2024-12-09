import { readInput } from '../utils';
const line = readInput(9)[0].split('').map(num => parseInt(num));

const files: [number, number | undefined][] = line.map((e, i) => {
	if (i % 2 == 0) return [e, Math.floor(i / 2)] as [number, number | undefined];
	else return [e, undefined] as [number, number | undefined];
}).filter(e => e[0] !== 0);

for (let i = Math.floor(line.length / 2); i >= 0; i--) {
	const currentFileIdx = files.findIndex(e => e[1] === i);
	const currentFile = files[currentFileIdx];
	const gapIdx = files.findIndex(e => e[1] === undefined && e[0] >= currentFile[0]);
	if (gapIdx >= 0 && gapIdx < currentFileIdx) {
		files[gapIdx][0] -= currentFile[0];
		files[currentFileIdx] = [currentFile[0], undefined];
		files.splice(gapIdx, 0, currentFile);
	}
}

let total = 0;
let currentPosition = 0;
files.forEach((element) => {
	for (let i = 0; i < element[0]; i++) {
		if (element[1] !== undefined) total += element[1] * (currentPosition + i);
	}
	currentPosition += element[0];
});
console.log(total);
