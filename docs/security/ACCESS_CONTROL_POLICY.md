# Access Control Policy

**Requirement ID**: AC-1, AC-2
**Effective Date**: 2026-02-02
**Review Cycle**: Annual

## 1. Purpose
To ensure that access to the `aitool-photo-optimizer` repository and associated infrastructure is restricted to authorized users and processes, adhering to the principle of Least Privilege.

## 2. Roles and Responsibilities (RBAC)

| Role | Description | Access Level |
|------|-------------|--------------|
| **Maintainer** | Core team members responsible for strategic direction and merging PRs. | Write/Admin on Repo, Publish rights to NPM. |
| **Contributor** | External or internal developers submitting changes. | Read on Repo, Fork, PR creation. |
| **CI/CD Bot** | Automated system for testing and publishing. | Limited Write (releases), Read secrets (scoped). |

## 3. Account Management (IA-2)

- **Identity Provider**: GitHub is the primary identity provider.
- **MFA Enforcement**: All Maintainers MUST have Multi-Factor Authentication (MFA) enabled on their GitHub and NPM accounts.
- **Account Review**: Access lists are reviewed quarterly. Inactive accounts (> 6 months) are offboarded.

## 4. Least Privilege (AC-2)

- Users and services are granted the minimum necessary permissions.
- **Branch Protection**: The `main` branch is protected. Direct pushes are disabled. All changes require a Pull Request (PR) with at least one approval.
- **Secrets**: Secrets (NPM tokens, etc.) are stored in GitHub Actions Secrets and exposed only to protected branches/environments.

## 5. Access Enforcement

- Access is enforced via GitHub Organization settings and NPM Team settings.
- Failure to comply with MFA requirements results in revocation of write access.
