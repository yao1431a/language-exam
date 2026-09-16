# Language Exam Platform Constitution

## Core Principles

### I. Offline-First
Every exam feature MUST work without network after initial load. Local IndexedDB is the source of truth for downloaded papers and attempts.

### II. Spec-Driven Development
All features begin as Spec Kit artifacts (spec, plan, tasks) before implementation. Code changes must align with the active feature spec.

### III. Exam Format Fidelity
UI and paper structure MUST mirror real TOEIC, TOEFL, IELTS, and JLPT section layouts. Content uses original practice questions, not copyrighted official items.

### IV. Progressive Sync
Online mode enhances offline mode: sync latest papers, never block core flows when offline.

### V. Simplicity
Single Next.js application. No external database or auth in v1. Minimize dependencies.

## Technology Standards

- Next.js App Router + TypeScript + Tailwind CSS
- Dexie (IndexedDB) for local persistence
- PWA service worker for asset caching
- Spec Kit (cursor-agent integration) for SDD workflow

## Governance

Constitution supersedes ad-hoc decisions. Amendments require updating this file and the feature spec.

**Version**: 1.0.0 | **Ratified**: 2025-09-16 | **Last Amended**: 2025-09-16
