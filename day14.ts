import { createFilled2D, readInput } from './utils';
import * as fs from 'fs';

type Vec2 = [number, number];

class Robot {
	pos: Vec2;
	vel: Vec2;

	constructor(line: string) {
		const matches = line.matchAll(/p=(-*\d+),(-*\d+) v=(-*\d+),(-*\d+)/gm).toArray()[0].slice(1, 6).map(num => parseInt(num));
		this.pos = matches.slice(0, 2) as Vec2;
		this.vel = matches.slice(2, 4) as Vec2;
	}

	getPosition(time: number, gridSize: Vec2): Vec2 {
		let x = (this.pos[0] + this.vel[0] * time) % gridSize[0];
		if (x < 0) x += gridSize[0];
		let y = (this.pos[1] + this.vel[1] * time) % gridSize[1];
		if (y < 0) y += gridSize[1];
		return [x, y];
	}
}

function getGridDisplay(positions: Vec2[], gridSize: Vec2) {
	const grid = createFilled2D(gridSize[1], gridSize[0], '.');
	positions.forEach(pos => grid[pos[1]][pos[0]] = '#');
	return grid.map(row => row.join('')).join('\n');
}

function part1(robots: Robot[], gridSize: Vec2) {
	const finalPositions = robots.map(robot => robot.getPosition(100, gridSize));
	const hMid = (gridSize[0] - 1) / 2;
	const vMid = (gridSize[1] - 1) / 2;
	const quadrants = finalPositions.reduce((acc, pos) => {
		if (pos[0] > hMid) {
			if (pos[1] > vMid) acc[0]++;
			else if (pos[1] < vMid) acc[3]++;
		}
		else if (pos[0] < hMid) {
			if (pos[1] > vMid) acc[1]++;
			else if (pos[1] < vMid) acc[2]++;
		}
		return acc;
	}, [0, 0, 0, 0]);
	return quadrants.reduce((acc, cv) => acc * cv, 1);
}

function part2() {
	for (let i = 0; i < 10000; i++) {
		const match = getGridDisplay(robots.map(r => r.getPosition(i, gridSize)), gridSize).includes('###########');
		if (match) return i;
	}
	return 0;
}

function writeToFile(robots: Robot[], gridSize: Vec2) {
	fs.writeFileSync('out.txt', '');
	for (let i = 0; i <= 10000; i++) {
		const finalPositions = robots.map(robot => robot.getPosition(i, gridSize));
		fs.appendFileSync('out.txt', i + '\n' + getGridDisplay(finalPositions, gridSize) + '\n');
	}
}

const gridSize: Vec2 = [101, 103];
const robots: Robot[] = readInput(14).map(line => new Robot(line));
const pt2 = part2();
console.log(`Part 1: ${part1(robots, gridSize)}\nPart 2: ${pt2}\n${getGridDisplay(robots.map(r => r.getPosition(pt2, gridSize)), gridSize)}`);
// writeToFile(robots, gridSize);
