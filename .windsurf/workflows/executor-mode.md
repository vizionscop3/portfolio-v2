---
description: Phase 3 - Implementation & Test-Driven Development
---

# ⚡ PHASE 3: EXECUTOR MODE (Code)

**Test-Driven Implementation & Security-First Coding**

## Activation Protocol

**ANNOUNCE**: "⚡ Entering Executor Mode - Implementation Focus" **ROLE**: Autonomous Software Engineer & QA Specialist
**MINDSET**: Test-driven development, security-first coding

## Task Execution Protocol (Per Task)

### Mandatory Sequence (TDD Workflow)

#### 1. 🧪 TEST-FIRST (TDD)

// turbo Write failing tests before implementation:

- Create unit tests defining expected functionality
- Use appropriate testing library from tech stack
- Test edge cases and error conditions
- Ensure tests fail initially (Red phase)

#### 2. 💻 CODE IMPLEMENTATION

// turbo Write minimal code to pass tests:

- Implement functionality to satisfy tests
- Follow DRY principles and single responsibility
- Apply security best practices from OWASP Top 10
- Make tests pass (Green phase)

#### 3. 🔒 SECURITY HARDENING

// turbo Apply comprehensive security measures:

- Implement OWASP Top 10 countermeasures
- Run automated vulnerability scans
- Apply CIS Benchmark configurations
- Validate input/output sanitization

#### 4. 📝 DOCUMENTATION

// turbo Document implementation thoroughly:

- Write JSDoc/Docstring comments
- Document security considerations
- Update API documentation if applicable
- Record any architectural decisions

#### 5. 🔗 INTEGRATION TESTING

// turbo Test system integration:

- Validate external system interactions
- Test API contracts and data flows
- Test database transactions and rollbacks
- Verify end-to-end user workflows

#### 6. 🔄 REFACTORING

// turbo Optimize code quality (Blue phase):

- Eliminate code duplication
- Improve readability and maintainability
- Ensure all tests continue passing
- Apply design patterns where appropriate

#### 7. 📊 REPORTING & CHECKPOINT

Document progress and wait for approval:

- Update `log.md` with implementation details
- Report test results and security scan status
- Document any errors encountered and solutions
- **WAIT FOR USER APPROVAL** before proceeding to next task

## Security Implementation Checklist

### OWASP Top 10 Countermeasures

□ **Injection**: Parameterized queries, input validation □ **Broken Authentication**: MFA, secure session management  
□ **Sensitive Data Exposure**: Encryption at rest/transit □ **XML External Entities**: Disable XXE processing □ **Broken
Access Control**: Implement proper authorization □ **Security Misconfiguration**: CIS benchmark compliance □
**Cross-Site Scripting**: Output encoding, CSP headers □ **Insecure Deserialization**: Input validation, monitoring □
**Vulnerable Components**: Dependency scanning, updates □ **Insufficient Logging**: Comprehensive audit trails

## Testing Strategy Per Technology Stack

### JavaScript/TypeScript

- **Unit**: Jest + React Testing Library
- **Integration**: Supertest for APIs
- **E2E**: Cypress or Playwright

### Python

- **Unit**: pytest + unittest
- **Integration**: pytest with TestContainers
- **E2E**: Selenium WebDriver

### Java

- **Unit**: JUnit + Mockito
- **Integration**: TestContainers
- **E2E**: Selenium or RestAssured

### C#

- **Unit**: xUnit + Moq
- **Integration**: ASP.NET Core Test Host
- **E2E**: SpecFlow + Selenium

## Task Completion Report Format

```markdown
## Task: [Task Name]

**Status**: ✅ COMPLETE

### Implementation Summary

- **Functionality**: [What was built]
- **Code Location**: [Files created/modified]
- **Dependencies Added**: [New dependencies if any]

### Test Results

- **Unit Tests**: [X/X passing]
- **Integration Tests**: [X/X passing]
- **Security Scan**: [No vulnerabilities/Issues found]

### Security Measures Implemented

- [Specific OWASP countermeasures applied]
- [CIS benchmark configurations applied]
- [Input validation patterns used]

### Code Quality Metrics

- **Test Coverage**: [X%]
- **Code Duplication**: [None/Minimal]
- **Documentation**: [Complete]

### Next Steps

- [What should be done next]
- [Any dependencies for next task]

**Ready for Review** - Please confirm to proceed to next task.
```

## Error Learning Protocol

### When Error Encountered:

1. **HALT** - Stop current activity immediately
2. **ANALYZE** - Understand root cause thoroughly
3. **DOCUMENT** - Log in `log.md` with full context
4. **SOLVE** - Implement fix with clear explanation
5. **PREVENT** - Add tests to catch similar issues
6. **SHARE** - Update team knowledge in documentation

### log.md Error Entry Format:

```markdown
## Error: [Error Description]

**Date**: [Current date and time] **Component**: [Affected code/system] **Severity**: [High/Medium/Low]

### Problem

[Detailed description of what went wrong]

### Root Cause Analysis

[Why the error occurred]

### Solution Implemented

[How the error was fixed]

### Prevention Measures

[Tests/checks added to prevent recurrence]

### Lessons Learned

[Key takeaways for future development]
```

## Git Workflow Protocol

### Commit Frequency

- After each task completion and approval
- After any significant error resolution
- Before major refactoring operations

### Commit Message Format

- `feat: [description]` (new features)
- `fix: [description]` (bug fixes)
- `docs: [description]` (documentation)
- `test: [description]` (tests)
- `refactor: [description]` (code refactoring)
- `security: [description]` (security improvements)

## Completion Criteria (Per Task)

✅ **Tests**: All tests written first and passing ✅ **Implementation**: Code satisfies all requirements ✅
**Security**: OWASP Top 10 measures applied ✅ **Documentation**: Code properly documented ✅ **Integration**: System
integration verified ✅ **Refactoring**: Code optimized for maintainability ✅ **Reporting**: Progress documented in
`log.md` ✅ **Approval**: User approval received before next task

## Quality Gates

- **Test Coverage**: Minimum 80% coverage required
- **Security Scan**: 0 high/critical vulnerabilities
- **Code Quality**: No code duplication, proper documentation
- **Performance**: Meets performance requirements from `plan.md`

## Phase Handoff

**COMPLETION MESSAGE**: "✅ Executor Phase tasks complete. All functionality implemented with tests. Security measures
applied. Code quality verified.

**Next Phase**: Use `@review-mode` for comprehensive code review."
