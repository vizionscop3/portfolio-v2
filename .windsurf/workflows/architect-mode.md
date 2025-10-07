---
description: Phase 1 - Strategic Planning & Architecture Design
---

# 🏗️ PHASE 1: ARCHITECT MODE

**Strategic Planning & Security-First Architecture**

## Activation Protocol

**ANNOUNCE**: "🏗️ Entering Architect Phase - Strategic Planning Mode" **ROLE**: High-Level Systems Architect & Security
Analyst **MINDSET**: Security-first, scalable architecture design

## Discovery Questions (Required)

### Application Fundamentals

1. **Application Type**: Web/Mobile/Desktop/API?
2. **Target Platform(s)**: Deployment environment?
3. **Core Purpose**: Primary user journey?
4. **User Base**: Expected size and growth?

### Security & Compliance

5. **Security Requirements**: Compliance needs?
6. **Data Sensitivity**: Public/Internal/Confidential?
7. **Authentication**: Auth/authorization requirements?
8. **Regulatory**: GDPR, HIPAA, SOX compliance?

### Performance & Scale

9. **Performance**: Response times, throughput expectations?
10. **Scalability**: Concurrent users expected?
11. **Budget**: Infrastructure constraints?
12. **Integration**: Existing system requirements?

## Architecture Design Process

### Step 1: Threat Modeling

// turbo Create threat model using OWASP methodology:

- Identify attack vectors and threat actors
- Map data flow and trust boundaries
- Define security controls and mitigations
- Document findings in `plan.md`

### Step 2: Technology Stack Selection

// turbo Select optimal technology stack:

- **Web**: React/Next.js + TypeScript + Node.js/Express + PostgreSQL/MongoDB
- **Mobile**: React Native + TypeScript + Firebase/Supabase
- **Desktop**: Electron + React + TypeScript
- **API-First**: Node.js/Express + TypeScript + PostgreSQL + Redis

Validate against CIS Benchmarks and document rationale.

### Step 3: System Architecture Design

// turbo Design scalable, modular architecture:

- Define API contracts and data models
- Plan microservices vs monolithic approach
- Design database schema and relationships
- Plan monitoring and observability strategy

### Step 4: Documentation Creation

// turbo Create comprehensive project documentation:

- Initialize `plan.md` with complete technical architecture
- Create `log.md` for error tracking and learning
- Document security threat model
- Set up git repository structure

## Required Deliverables

### plan.md Template

```markdown
# [Project Name] - Technical Architecture Plan

## Executive Summary

- **Project**: [Name and description]
- **Architecture**: [High-level approach]
- **Security Posture**: [Security strategy]
- **Timeline**: [Development phases]

## Technology Stack

- **Frontend**: [Framework and rationale]
- **Backend**: [Framework and rationale]
- **Database**: [System and rationale]
- **Infrastructure**: [Deployment strategy]

## Security Architecture

- **Threat Model**: [Key threats and mitigations]
- **Authentication**: [Auth strategy]
- **Data Protection**: [Encryption and privacy]
- **OWASP Compliance**: [Top 10 countermeasures]

## System Architecture

- **Components**: [Major system components]
- **APIs**: [API design and contracts]
- **Data Flow**: [How data moves through system]
- **Deployment**: [Infrastructure and CI/CD]

## File Structure

[Complete project directory structure]

## Next Steps

- Proceed to @designer-mode for UX planning
```

### log.md Template

```markdown
# Project Learning Log

## Setup Phase

**Date**: [Current date] **Phase**: Architect Mode **Status**: ✅ Complete

### Decisions Made

- [Key architectural decisions]
- [Technology choices and rationale]
- [Security measures planned]

### Lessons Learned

- [Any challenges encountered]
- [Solutions implemented]
- [Best practices applied]

## Error Tracking

[This section will be populated as errors occur]
```

## Completion Criteria

✅ All discovery questions answered and documented ✅ Threat model completed using OWASP methodology ✅ Technology stack
selected and justified ✅ System architecture designed and documented ✅ `plan.md` file created with complete
specifications ✅ `log.md` file initialized for error tracking ✅ Git repository initialized with initial commit ✅ File
structure and coding conventions defined

## Phase Handoff

**COMPLETION MESSAGE**: "✅ Architect Phase complete. Technical blueprint documented in `plan.md`. Security threat model
established. Technology stack validated.

**Next Phase**: After git commit, proceed with: `@designer-mode`"

## Quality Gates

- **Security**: All OWASP Top 10 threats addressed in design
- **Scalability**: Architecture supports expected growth
- **Maintainability**: Modular design follows DRY principles
- **Documentation**: All decisions justified and recorded
