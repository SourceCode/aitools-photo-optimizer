"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmptyManifest = createEmptyManifest;
exports.mergeManifests = mergeManifests;
function createEmptyManifest() {
    return {
        version: 1,
        generatedAt: new Date().toISOString(),
        entries: {},
    };
}
function mergeManifests(base, update) {
    return {
        ...base,
        generatedAt: new Date().toISOString(), // Update timestamp
        entries: {
            ...base.entries,
            ...update.entries,
        },
    };
}
