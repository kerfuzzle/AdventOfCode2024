import * as fs from 'fs';
const lines = fs.readFileSync('./inputs/day1.txt', 'utf-8').split('\n');

const list1 = lines.map(line => parseInt(line.split('   ')[0])).toSorted();
const list2 = lines.map(line => parseInt(line.split('   ')[1])).toSorted();

let distance = 0;
let simScore = 0;
for (let i = 0; i < list1.length; i++) {
	distance += Math.abs(list1[i] - list2[i]);
	simScore += list2.filter(item => item === list1[i]).length * list1[i];
}

console.log(`Part 1: ${distance}\nPart 2: ${simScore}`);
