# Incident Response Plan

**Requirement ID**: IR-4
**Effective Date**: 2026-02-02

## 1. Preparation
- **Contact**: Security issues should be reported to the repository maintainers via GitHub Security Advisories or private email (if listed). Do NOT open public issues for vulnerabilities.
- **Tools**: GitHub Dependabot, `pnpm audit`.

## 2. Detection & Analysis
- **Sources**:
    - Automated alerts (Dependabot, Snyk).
    - User reports.
    - Anomaly detection in logs (if applicable for hosted components).
- **Triage**: Assign severity (Low, Medium, High, Critical) based on CVSS score and exploitability in our context.

## 3. Containment, Eradication, & Recovery
- **Containment**:
    - For bad dependencies: Lock version to safe commit or remove dependency.
    - For leaked keys: Revoke keys immediately.
- **Eradication**: Patch the vulnerability (update package, fix code).
- **Recovery**: Verify the fix with tests. Redeploy/Publish new version.

## 4. Post-Incident Activity
- **Review**: specific retrospective to identify root cause.
- **Update**: Update `RISK_REGISTER.md` and this plan if gaps were found.

## Runbook: Vulnerable Dependency
1. Receive alert (e.g., `pnpm audit`).
2. Verify impact: Does the code use the vulnerable function?
3. If yes, create a hotfix branch.
4. Update dependency or apply mitigation.
5. Test validation.
6. Merge and Release.
