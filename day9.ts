import { readInput } from './utils';

interface BlockGroup {
	isFile: boolean;
	length: number;
	id: number;
}

class FileSystem {
	groups: BlockGroup[];
	fileCount = 0;

	constructor(diskMap: number[]) {
		this.groups = diskMap.map((num, i) => {
			if (i % 2 == 0) {
				this.fileCount++;
				return { isFile: true, length: num, id: Math.floor(i / 2) };
			}
			else return { isFile: false, length: num, id: -1 };
		}).filter(group => group.length !== 0);
	}

	sortDefragemented() {
		for (let i = this.fileCount - 1; i >= 0; i--) {
			const currentFileIdx = this.groups.findIndex(g => g.id === i);
			const currentFile = this.groups[currentFileIdx];
			const gapIdx = this.groups.findIndex(g => !g.isFile && g.length >= currentFile.length);
			if (gapIdx >= 0 && gapIdx < currentFileIdx) {
				this.groups[gapIdx].length -= currentFile.length;
				this.groups[currentFileIdx] = { isFile: false, length: currentFile.length, id: -1 };
				this.groups.splice(gapIdx, 0, currentFile);
			}
		}
		return this;
	}

	sortFragmented() {
		let remainingFiles = this.fileCount;
		while (remainingFiles >= 0) {
			const fileIdx = this.groups.findLastIndex(g => g.isFile && g.length > 0);
			const file = this.groups[fileIdx];
			while (file.length > 0) {
				const gapIdx = this.groups.findIndex(g => !g.isFile);
				if (gapIdx >= 0) {
					const gap = this.groups[gapIdx];
					if (gap.length >= file.length) {
						gap.length -= file.length;
						this.groups.splice(gapIdx, 0, { isFile: true, length: file.length, id: file.id });
						this.groups.splice(fileIdx + 2, 0, { isFile: false, length: file.length, id: -1 });
						file.length = 0;
					}
					else {
						gap.isFile = true;
						gap.id = file.id;
						this.groups.splice(fileIdx + 1, 0, { isFile: false, length: gap.length, id: -1 });
						file.length -= gap.length;
					}
				}
			}
			remainingFiles--;
		}
		return this;
	}

	calculateChecksum() {
		let overallPosition = 0;
		return this.groups.reduce((acc, group) => {
			if (!group.isFile) {
				overallPosition += group.length;
				return acc;
			}
			const total = group.id * 0.5 * (group.length) * (2 * overallPosition + group.length - 1);
			overallPosition += group.length;
			return acc + total;
		}, 0);
	}
}

const diskMap = readInput(9)[0].split('').map(num => parseInt(num));
console.log(`Part 1: ${new FileSystem(diskMap).sortFragmented().calculateChecksum()}`);
console.log(`Part 2: ${new FileSystem(diskMap).sortDefragemented().calculateChecksum()}`);
