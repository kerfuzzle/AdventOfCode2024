import { readInput } from './utils';

class Graph {
	nodes = new Map<string, Node>();

	addConnection(pair: string[]) {
		if (!this.nodes.has(pair[0])) this.nodes.set(pair[0], new Node(pair[0]));
		if (!this.nodes.has(pair[1])) this.nodes.set(pair[1], new Node(pair[1]));
		const node1 = this.nodes.get(pair[0])!;
		const node2 = this.nodes.get(pair[1])!;
		node1.neighbours.add(node2);
		node2.neighbours.add(node1);
	}

	find3Cliques(nodes: Node[] = this.nodes.values().toArray(), minIdx = 0, currentClique: Node[] = [], result: Node[][] = []) {
		for (let i = minIdx; i < nodes.length; i++) {
			const clique = currentClique.concat(nodes[i]);
			if (Graph.isClique(clique)) {
				if (clique.length === 3) result.push(clique);
				else this.find3Cliques(nodes, i + 1, clique, result);
			}
		}
		return result;
	}

	findLargestClique(nodes: Node[] = this.nodes.values().toArray(), minIdx = 0, currentClique: Node[] = [], largestClique: { nodes: Node[] } = { nodes: [] }) {
		for (let i = minIdx; i < nodes.length; i++) {
			const clique = currentClique.concat(nodes[i]);
			if (Graph.isClique(clique)) {
				if (clique.length > largestClique.nodes.length) largestClique.nodes = clique;
				this.findLargestClique(nodes, i + 1, clique, largestClique);
			}
		}
		return largestClique.nodes;
	}

	static isClique(clique: Node[]) {
		return clique.every((n) => {
			return clique.every(c => c === n || n.neighbours.has(c));
		});
	}
}

class Node {
	name: string;
	neighbours = new Set<Node>();

	constructor(name: string) {
		this.name = name;
	}
}

function part1(graph: Graph) {
	return graph.find3Cliques().filter(clique => clique.some(n => n.name.startsWith('t'))).length;
}

function part2(graph: Graph) {
	return graph.findLargestClique().map(c => c.name).sort().join(',');
}

const conections = readInput(23).map(line => line.split('-'));
const graph = new Graph();
conections.forEach(c => graph.addConnection(c));
console.log(`Part 1: ${part1(graph)}\nPart 2: ${part2(graph)}`);
