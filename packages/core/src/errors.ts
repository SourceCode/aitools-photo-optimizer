export class BaseError extends Error {
    constructor(public code: string, message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class ConfigError extends BaseError {
    constructor(message: string, public field?: string) {
        super('APO_ERR_CONFIG', message);
    }
}

export class OptimizationError extends BaseError {
    constructor(message: string, public file?: string) {
        super('APO_ERR_OPTIMIZATION', message);
    }
}

export class ManifestError extends BaseError {
    constructor(message: string) {
        super('APO_ERR_MANIFEST', message);
    }
}
