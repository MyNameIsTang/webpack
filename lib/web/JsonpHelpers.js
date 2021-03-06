/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

/** @typedef {import("../Chunk")} Chunk */
/** @typedef {import("../ChunkGraph")} ChunkGraph */
/** @typedef {import("../ChunkGroup")} ChunkGroup */
/** @typedef {(string|number)[]} EntryItem */

/**
 * @param {ChunkGroup} chunkGroup a chunk group
 * @returns {Set<Chunk>} chunks
 */
const getAllChunks = chunkGroup => {
	const queue = new Set([chunkGroup]);
	const chunks = new Set();
	for (const chunkGroup of queue) {
		for (const chunk of chunkGroup.chunks) {
			chunks.add(chunk);
		}
		for (const parent of chunkGroup.parentsIterable) {
			queue.add(parent);
		}
	}
	return chunks;
};

/**
 * @param {ChunkGraph} chunkGraph the chunk graph
 * @param {Chunk} chunk the chunk
 * @returns {EntryItem[]} serialized entry info:
 * inner arrays have this format [module id, ...chunk ids]
 */
exports.getEntryInfo = (chunkGraph, chunk) => {
	return Array.from(
		chunkGraph.getChunkEntryModulesWithChunkGroupIterable(chunk)
	).map(([module, chunkGroup]) =>
		[chunkGraph.getModuleId(module)].concat(
			Array.from(getAllChunks(chunkGroup), c => c.id).filter(
				id => id !== chunk.id
			)
		)
	);
};

exports.needEntryDeferringCode = (compilation, chunk) => {
	for (const entrypoint of compilation.entrypoints.values()) {
		if (entrypoint.getRuntimeChunk() === chunk) {
			if (entrypoint.chunks.some(c => c !== chunk)) return true;
		}
	}
	return false;
};
