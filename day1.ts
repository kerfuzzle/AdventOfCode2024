import { countOccurences, readInput } from './utils';
const lines = readInput(1);

const list1 = lines.map(line => parseInt(line.split('   ')[0])).toSorted();
const list2 = lines.map(line => parseInt(line.split('   ')[1])).toSorted();

const distance = list1.reduce((acc, current, i) => acc + Math.abs(current - list2[i]), 0);
const simScore = list1.reduce((acc, current) => acc + countOccurences(list2, current) * current, 0);

console.log(`Part 1: ${distance}\nPart 2: ${simScore}`);
