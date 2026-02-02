"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContentHash = createContentHash;
exports.createOptionsHash = createOptionsHash;
exports.generateOutputName = generateOutputName;
const crypto_1 = __importDefault(require("crypto"));
function createContentHash(buffer) {
    const hash = crypto_1.default.createHash('sha256');
    hash.update(buffer);
    return hash.digest('hex').substring(0, 16);
}
function createOptionsHash(options) {
    // Sort keys to ensure stability
    const stableString = JSON.stringify(options, Object.keys(options).sort());
    const hash = crypto_1.default.createHash('sha256');
    hash.update(stableString);
    return hash.digest('hex').substring(0, 8);
}
function generateOutputName(contentHash, width, height, format, optionsHash) {
    return `${contentHash}_${width}x${height}_${optionsHash}.${format}`;
}
