# Risk Register

**Requirement ID**: PM-9, RA-5
**Last Updated**: 2026-02-02

| Risk ID | Description | Severity | Status | Mitigation | Owner |
|---------|-------------|----------|--------|------------|-------|
| R-001 | **Supply Chain Attack**: Malicious code in NPM dependencies. | High | Active | Use `pnpm-lock.yaml`, Dependabot, specific version pinning. | Maintainer |
| R-002 | **Leaked Secrets**: Accidental commit of API keys. | Critical | Active | `.gitignore`, pre-commit hooks (Husky), secret scanning. | Maintainer |
| R-003 | **DoS via Large Images**: Processing massive images exhausts memory. | Medium | Mitigated | `sharp` limits, `maxFileSizeBytes` config option. | Core Team |
| R-004 | **Vulnerable Dependency**: `esbuild` < 0.25.0. | Moderate | Remediation Verified | `pnpm.overrides` enforced version `^0.25.0`. | Maintainer |
| R-005 | **Vulnerable Dependency**: `eslint` < 9.26.0 (DoS). | Moderate | Accepted | Dev-dependency only. Risk limited to build time. Upgrade planned for next major release. | Maintainer |

## Risk Matrix
- **Low**: Minimal impact, unlikely.
- **Medium**: Noticeable impact, possible.
- **High**: Significant impact, likely.
- **Critical**: Catastrophic impact, imminent/occurred.
