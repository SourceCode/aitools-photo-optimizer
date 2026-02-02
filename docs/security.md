# Security

This document outlines the security policies and procedures for the `aitool-photo-optimizer` project. We adhere to **NIST 800-53 Rev5** standards where applicable to our software development lifecycle.

## Policies & Procedures

Please refer to the following documents for specific compliance details:

- **[Access Control Policy](./security/ACCESS_CONTROL_POLICY.md)** (AC-1, AC-2)
    - Roles, Least Privilege, and Account Management.
- **[Configuration Baseline](./security/CONFIGURATION_BASELINE.md)** (CM-2)
    - Standard configurations for the repository and tools.
- **[Incident Response Plan](./security/INCIDENT_RESPONSE.md)** (IR-4)
    - How we handle and report security incidents.
- **[Risk Register](./security/RISK_REGISTER.md)** (PM-9)
    - Tracked risks and active mitigations.

## Dependencies

- We use `pnpm` with lockfiles to ensure deterministic installs.
- Periodic `pnpm audit` checks are enforced.
- Vulnerabilities are tracked in the Risk Register.

## File System Access

- The tool is designed to read from a source Glob and write to a specific output directory.
- **Risk**: Malicious Glob patterns could potentially read files outside intended scope.
- **Mitigation**: Run in a containerized environment if processing untrusted user input.

## Secrets

- This tool does not handle keys, tokens, or credentials.
- Do **NOT** commit `.env` or config files containing secrets.
