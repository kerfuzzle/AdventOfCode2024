import { readInput, splitArray } from './utils';

enum State { OFF, ON, NEUTRAL }
enum Type { AND, OR, XOR }
interface Wire { state: State; name: string }

class Gate {
	input1: Wire;
	input2: Wire;
	output: Wire;
	type: Type;

	constructor(input1: Wire, input2: Wire, output: Wire, type: string) {
		this.input1 = input1;
		this.input2 = input2;
		this.output = output;
		if (type === 'OR') this.type = Type.OR;
		else if (type === 'AND') this.type = Type.AND;
		else if (type === 'XOR') this.type = Type.XOR;
		else throw Error('Not a valid type');
	}

	runGate(gates: Gate[]) {
		if (this.input1.state === State.NEUTRAL || this.input2.state === State.NEUTRAL || this.output.state !== State.NEUTRAL) return;
		let output: boolean;
		if (this.type === Type.OR) output = this.input1.state === State.ON || this.input2.state === State.ON;
		else if (this.type === Type.AND) output = this.input1.state === State.ON && this.input2.state === State.ON;
		else output = (this.input1.state === State.ON) !== (this.input2.state === State.ON);
		this.output.state = output ? State.ON : State.OFF;
		const relevantGates = gates.filter(g => g.input1 === this.output || g.input2 === this.output);
		relevantGates.forEach(g => g.runGate(gates));
	}

	hasInput = (wire: Wire) => this.input1 === wire || this.input2 === wire;
	hasInputNamed = (wireName: string) => this.input1.name === wireName || this.input2.name === wireName;
}

function getWire(wires: Wire[], wireName: string) {
	let wire = wires.find(w => w.name === wireName);
	if (wire) return wire;
	wire = { name: wireName, state: State.NEUTRAL };
	wires.push(wire);
	return wire;
}

function sortWires(wires: Wire[]) {
	return wires.toSorted((a, b) => {
		if (a.name.startsWith(b.name.charAt(0))) {
			if (isNaN(parseInt(a.name.slice(1, 3))) || isNaN(parseInt(b.name.slice(1, 3)))) return a.name.localeCompare(b.name);
			else return parseInt(a.name.slice(1, 3)) - parseInt(b.name.slice(1, 3));
		}
		else return a.name.localeCompare(b.name);
	});
}

function part1(gates: Gate[]) {
	gates.forEach(g => g.runGate(gates));
	const zWires = sortWires(wires.filter(w => w.name.startsWith('z')));
	return parseInt(zWires.map(w => w.state).reverse().join(''), 2);
}

function part2(gates: Gate[]) {
	const swapped: Wire[] = [];
	for (let i = 1; i < 45; i++) {
		const id = i.toString().padStart(2, '0');
		const inGate = gates.find(g => g.type === Type.XOR && g.hasInputNamed(`x${id}`) && g.hasInputNamed(`y${id}`))!;
		const correctOut = gates.find(g => g.output.name === `z${id}`)!;
		const outGate = gates.find(g => g.type === Type.XOR && g.hasInput(inGate.output));
		if (outGate === undefined) {
			const incorrectOut = gates.find(g => correctOut.hasInput(g.output) && g.type !== Type.OR);
			if (incorrectOut && inGate) swapped.push(incorrectOut.output, inGate.output);
		}
		else if (outGate.output.name !== `z${id}`) swapped.push(correctOut.output, outGate.output);
	}
	return sortWires(swapped).map(w => w.name).join(',');
}

const sections = splitArray(readInput(24), '');
const wires: Wire[] = sections[0].map((line) => {
	return { name: line.split(': ')[0], state: line.split(': ')[1] === '1' ? State.ON : State.OFF };
});
const gates = sections[1].map((line) => {
	const parts = line.split(' ');
	return new Gate(getWire(wires, parts[0]), getWire(wires, parts[2]), getWire(wires, parts[4]), parts[1]);
});

console.log(`Part 1: ${part1(gates)}\nPart 2: ${part2(gates)}`);
