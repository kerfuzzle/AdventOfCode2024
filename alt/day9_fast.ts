import { readInput } from '../utils';
const line = readInput(9)[0].split('').map(num => parseInt(num));
const files = line.filter((_, i) => i % 2 === 0);
const gaps = line.filter((_, i) => i % 2 === 1);
const result = [];

let currentGap = 0;
let blockLength = 0;
let blockID = 0;
let jumpedCount = 0;
while (files.length > 0 || blockLength > 0) {
	if (blockLength <= 0) {
		blockLength = files.pop()!;
		blockID = files.length + jumpedCount;
	}
	if (currentGap <= 0) {
		currentGap = gaps.shift()!;
		if (files.length > 0) {
			const jumpedBlock = files.shift();
			result.push([jumpedBlock, jumpedCount]);
			jumpedCount++;
		}
	}

	if (currentGap >= blockLength) {
		result.push([blockLength, blockID]);
		currentGap -= blockLength;
		blockLength = 0;
	}
	else {
		result.push([currentGap, blockID]);
		blockLength -= currentGap;
		currentGap = 0;
	}
}

let total = 0;
let currentPosition = 0;
result.forEach((element) => {
	total += element[1]! * 0.5 * (element[0]!) * (2 * currentPosition + element[0]! - 1);
	currentPosition += element[0]!;
});
console.log(Bun.nanoseconds() * 10 ** -6);
console.log(total);
