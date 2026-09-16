# Implementation Plan: Language Exam Platform

**Branch**: `001-language-exam-platform` | **Date**: 2025-09-16 | **Spec**: [spec.md](./spec.md)

## Summary

Build an offline-first PWA for language exam practice covering TOEIC, TOEFL, IELTS, and JLPT N1–N5. Seed 5 years of practice papers locally; sync latest papers when online; generate mock exams from a question bank.

## Technical Context

**Language/Version**: TypeScript 5, Node 22, Next.js 16

**Primary Dependencies**: Next.js, React 19, Dexie, Tailwind CSS 4

**Storage**: IndexedDB via Dexie (client); JSON API routes (server)

**Testing**: Manual browser verification; ESLint

**Target Platform**: Modern browsers (PWA installable)

**Constraints**: Offline-capable; no backend database; no auth in v1

**Scale/Scope**: ~8 exam types × ~5 years × multiple sessions; demo-sized question sets

## Constitution Check

- Offline-first: PASS (IndexedDB + SW)
- Spec-driven: PASS (Spec Kit initialized)
- Simplicity: PASS (single Next.js app)

## Project Structure

```text
specs/001-language-exam-platform/
├── spec.md
├── plan.md
└── tasks.md

src/
├── app/                 # Next.js pages & API routes
├── components/          # UI components
├── hooks/               # useOnlineStatus
└── lib/
    ├── db/              # Dexie schema
    └── exams/           # types, seed, generator, sync

public/
├── manifest.json
├── sw.js
└── icon-*.png
```

**Structure Decision**: Single Next.js application with client-side persistence and lightweight API routes for sync/mock generation.
