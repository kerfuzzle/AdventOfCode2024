import { memoize, readInput } from './utils';
type Vec2 = [number, number];
interface Keypad { map: Map<string, Vec2>; avoid: Vec2 };

function generateKeypadMoves(code: string, previousKey: string, keypad: Keypad, currentPath = '', result: string[] = []) {
	if (code.length === 0) result.push(currentPath);
	else {
		const paths = generatePaths(keypad.map.get(previousKey)!, keypad.map.get(code.charAt(0))!, keypad.avoid);
		paths.forEach(path => generateKeypadMoves(code.substring(1), code.charAt(0), keypad, currentPath + path + 'A', result));
	}
	return result;
}

const findShortestSequence = memoize((code: string, keypad: Keypad, depth: number): number => {
	if (depth === 0) return code.length;
	const sections = code.split('A').map(s => s + 'A');
	if (code.endsWith('A')) sections.pop();
	return sections.reduce((total, section) => {
		const sequences = generateKeypadMoves(section, 'A', keypad);
		return total + Math.min(...sequences.map(s => findShortestSequence(s, keypad, depth - 1)));
	}, 0);
});

const generatePaths = memoize((startPos: Vec2, endPos: Vec2, avoid: Vec2) => {
	function *generator(startPos: Vec2, endPos: Vec2, avoid: Vec2, result = ''): Generator<string> {
		const dx = endPos[0] - startPos[0];
		const dy = endPos[1] - startPos[1];
		if (startPos[0] === avoid[0] && startPos[1] === avoid[1]) return;
		if (dx === 0 && dy === 0) yield result;
		if (dx > 0) yield * generator([startPos[0] + 1, startPos[1]], endPos, avoid, result + '>');
		if (dx < 0) yield * generator([startPos[0] - 1, startPos[1]], endPos, avoid, result + '<');
		if (dy > 0) yield * generator([startPos[0], startPos[1] + 1], endPos, avoid, result + 'v');
		if (dy < 0) yield * generator([startPos[0], startPos[1] - 1], endPos, avoid, result + '^');
	}
	return generator(startPos, endPos, avoid).toArray();
});

function solveCode(code: string, maxDepth: number, numericKeypad: Keypad, directionalKeypad: Keypad) {
	const numericKeypadMoves = generateKeypadMoves(code, 'A', numericKeypad);
	return Math.min(...numericKeypadMoves.map(s => findShortestSequence(s, directionalKeypad, maxDepth)));
}

function solveInput(codes: string[], maxDepth: number, numericKeypad: Keypad, directionalKeypad: Keypad) {
	return codes.reduce((acc, cv) => {
		return acc + parseInt(cv.slice(0, -1)) * solveCode(cv, maxDepth, numericKeypad, directionalKeypad);
	}, 0);
}

const codes = readInput(21);
const numericKeypad: Keypad = { map: new Map([['7', [0, 0]], ['8', [1, 0]], ['9', [2, 0]], ['4', [0, 1]], ['5', [1, 1]], ['6', [2, 1]], ['1', [0, 2]], ['2', [1, 2]], ['3', [2, 2]], ['0', [1, 3]], ['A', [2, 3]]]), avoid: [0, 3] };
const directionalKeypad: Keypad = { map: new Map([['^', [1, 0]], ['A', [2, 0]], ['<', [0, 1]], ['v', [1, 1]], ['>', [2, 1]]]), avoid: [0, 0] };
console.log(`Part 1: ${solveInput(codes, 2, numericKeypad, directionalKeypad)}\nPart 2: ${solveInput(codes, 25, numericKeypad, directionalKeypad)}`);
