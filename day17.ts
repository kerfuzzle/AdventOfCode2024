import { readInput, splitArray } from './utils';

class Program {
	instructionPointer = 0;
	instructions: number[];
	output: bigint[] = [];
	jumped = false;
	registers: { a: bigint; b: bigint; c: bigint } = { a: 0n, b: 0n, c: 0n };
	operators: ((a: number, program: Program) => void)[] = [];

	constructor(programString: string, operators: ((a: number, program: Program) => void)[]) {
		this.instructions = programString.split(',').map(num => parseInt(num));
		this.operators = operators;
	}

	getComboOperand(operand: number) {
		if (operand <= 3) return BigInt(operand);
		else if (operand === 4) return BigInt(this.registers.a);
		else if (operand === 5) return BigInt(this.registers.b);
		else if (operand === 6) return BigInt(this.registers.c);
		throw Error('Invalid operand');
	}

	resetProgram() {
		this.instructionPointer = 0;
		this.output = [];
		this.jumped = false;
	}

	run(a: bigint, b: bigint, c: bigint) {
		this.registers = { a: a, b: b, c: c };
		this.resetProgram();
		while (this.instructions[this.instructionPointer + 1] !== undefined) {
			const operator = this.instructions[this.instructionPointer];
			const operand = this.instructions[this.instructionPointer + 1];
			this.operators[operator](operand, this);
			if (!this.jumped) this.instructionPointer += 2;
			this.jumped = false;
		}
		return this.output;
	}

	*findQuines(currentA = 0n, currentTargetIdx = 0): Generator<bigint> {
		if (currentTargetIdx === this.instructions.length) {
			yield currentA >> 3n;
			return;
		}
		const currentTarget = BigInt(this.instructions.toReversed()[currentTargetIdx]);
		for (let i = 0n; i < 8; i++) {
			const runResult = this.run(currentA | i, 0n, 0n);
			if (runResult.shift() === currentTarget) {
				yield * this.findQuines((currentA | i) << 3n, currentTargetIdx + 1);
			}
		}
	}
}
const sections = splitArray(readInput(17), '');
const initialRegisters = sections[0].map(line => BigInt(line.split(': ')[1]));
const operators = [
	(op: number, program: Program) => { // adv
		program.registers.a = program.registers.a >> program.getComboOperand(op);
	},
	(op: number, program: Program) => { /// bxl
		program.registers.b = program.registers.b ^ BigInt(op);
	},
	(op: number, program: Program) => { /// bst
		program.registers.b = program.getComboOperand(op) & 7n;
	},
	(op: number, program: Program) => { // jnz
		if (program.registers.a === 0n) return;
		program.instructionPointer = op;
		program.jumped = true;
	},
	(_: number, program: Program) => { // bxc
		program.registers.b = program.registers.b ^ program.registers.c;
	},
	(op: number, program: Program) => { // out
		program.output.push(program.getComboOperand(op) & 7n);
	},
	(op: number, program: Program) => { // bdv
		program.registers.b = program.registers.a >> program.getComboOperand(op);
	},
	(op: number, program: Program) => { // cdv
		program.registers.c = program.registers.a >> program.getComboOperand(op);
	},
];
const program = new Program(sections[1][0].split(': ')[1], operators);
const pt1 = program.run(initialRegisters[0], initialRegisters[1], initialRegisters[2]).join(',');
const pt2 = program.findQuines();
console.log(`Part 1: ${pt1}\nPart 2: ${pt2.next().value}`);
