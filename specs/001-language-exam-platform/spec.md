# Feature Specification: Language Exam Platform

**Feature Branch**: `001-language-exam-platform`

**Created**: 2025-09-16

**Status**: Implemented

**Input**: 可联网/断网访问的网页考试平台，支持托业、托福、雅思、日语 N1-N5，近 5 年真题，联网下载最新真题，自动生成模拟试卷。

## User Scenarios & Testing

### User Story 1 - 离线练习真题 (Priority: P1)

用户打开网页后，无需联网即可浏览并作答已内置的近 5 年真题练习版。

**Why this priority**: 核心学习场景，地铁/航班等无网环境必须可用。

**Independent Test**: 断网后打开首页，选择 TOEIC 2023 年试卷并完成答题评分。

**Acceptance Scenarios**:

1. **Given** 首次访问且联网, **When** 页面加载完成, **Then** 本地 IndexedDB 自动写入全部种子真题
2. **Given** 已加载应用且断网, **When** 用户进入任意试卷, **Then** 可正常答题并查看得分

---

### User Story 2 - 联网同步最新真题 (Priority: P2)

联网时用户点击同步，下载各考试类型最新一次试卷并保存到本地。

**Acceptance Scenarios**:

1. **Given** 用户联网, **When** 点击「同步最新真题」, **Then** 8 类考试各更新 1 套最新版试卷
2. **Given** 用户断网, **When** 点击同步, **Then** 按钮禁用并提示离线

---

### User Story 3 - 生成模拟试卷 (Priority: P2)

用户选择考试类型与题量，系统随机组卷并保存，可立即开考。

**Acceptance Scenarios**:

1. **Given** 联网, **When** 生成模拟卷, **Then** 通过 API 组卷并写入本地
2. **Given** 离线, **When** 生成模拟卷, **Then** 浏览器本地组卷成功

---

## Requirements

### Functional Requirements

- **FR-001**: 系统 MUST 支持 TOEIC、TOEFL、IELTS、JLPT N1–N5 八种考试类型
- **FR-002**: 系统 MUST 内置 2021–2025 年各场次真题练习版（原创题目，非官方原文）
- **FR-003**: 联网时 MUST 可从 `/api/sync` 下载最新试卷
- **FR-004**: 系统 MUST 支持模拟试卷自动生成
- **FR-005**: 系统 MUST 在 IndexedDB 持久化试卷与考试记录
- **FR-006**: 系统 MUST 注册 Service Worker 以支持离线访问
- **FR-007**: 系统 MUST 使用 Spec Kit 管理规格与任务

### Key Entities

- **ExamPaper**: 试卷（类型、年份、场次、分区、题目）
- **Question**: 单题（题干、选项、答案、解析）
- **ExamAttempt**: 一次作答记录（答案、得分、时间）

## Success Criteria

- **SC-001**: 断网状态下可完成至少一套完整试卷流程
- **SC-002**: 同步操作在 10 秒内完成（本地环境）
- **SC-003**: 模拟卷生成后 3 秒内可开始考试

## Assumptions

- 题目内容为原创练习题，模拟真实考试结构与难度分布
- 用户通过现代浏览器访问（Chrome、Safari、Edge）
- 本地路径目标为 `/Users/yao/ai-coding/language exam`（开发机部署位置）
