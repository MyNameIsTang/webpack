/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const Dependency = require("../Dependency");
const makeSerializable = require("../util/makeSerializable");
const ModuleDependency = require("./ModuleDependency");

/** @typedef {import("../Dependency").ReferencedExport} ReferencedExport */
/** @typedef {import("../ModuleGraph")} ModuleGraph */

class ContextElementDependency extends ModuleDependency {
	constructor(request, userRequest, referencedExports) {
		super(request);
		this.referencedExports = referencedExports;

		if (userRequest) {
			this.userRequest = userRequest;
		}
	}

	get type() {
		return "context element";
	}

	/**
	 * Returns list of exports referenced by this dependency
	 * @param {ModuleGraph} moduleGraph module graph
	 * @returns {(string[] | ReferencedExport)[]} referenced exports
	 */
	getReferencedExports(moduleGraph) {
		return this.referencedExports
			? this.referencedExports.map(e => ({
					name: e,
					canMangle: false
			  }))
			: Dependency.EXPORTS_OBJECT_REFERENCED;
	}

	serialize(context) {
		context.write(this.referencedExports);
		super.serialize(context);
	}

	deserialize(context) {
		this.referencedExports = context.read();
		super.deserialize(context);
	}
}

makeSerializable(
	ContextElementDependency,
	"webpack/lib/dependencies/ContextElementDependency"
);

module.exports = ContextElementDependency;
