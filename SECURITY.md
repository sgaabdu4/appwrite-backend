# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.8.x   | :white_check_mark: |
| < 1.8   | :x:                |

## Reporting a Vulnerability

Found vuln in skill? Report responsibly:

1. **Do NOT open a public issue** for security vulnerabilities
2. Email security concerns to the repository owner
3. Include:
   - Vuln description
   - Repro steps
   - Impact
   - Suggested fix (if any)

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 7 days
- **Resolution**: Depends on severity

### What to Expect

- All reports taken seriously
- Prompt investigation + response
- Reporter credit in changelog (unless anonymous preferred)

## Security Best Practices for Users

Using skill:

1. **Never commit secrets** - Env vars for API keys
2. **Review generated code** - Review before run
3. **Keep dependencies updated** - Update Appwrite SDK often
4. **Use proper permissions** - Least privilege in Appwrite

## Scope

Policy covers skill docs + included code examples. Not covered:

- Third-party deps
- Appwrite platform itself
- Your implementation of patterns