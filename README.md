# Library App Comments Service / コメントサービス

Distributed Library System — Comments Service

分散型図書館システム — コメントサービス

---

## Overview / 概要

The Comments Service is responsible for managing user-generated content within the distributed library platform.

It allows users to create, retrieve, update, and delete book reviews, ratings, and comments while maintaining content
validation and sanitization rules.

Built with Node.js and Express, the service leverages MongoDB's flexible document model to efficiently store and
retrieve social interaction data at scale.

---

Comments Service は分散型図書館システムにおけるユーザー生成コンテンツ管理サービスです。

書籍に対するコメント、レビュー、評価の作成・取得・更新・削除を担当します。

MongoDB の柔軟なドキュメントモデルを活用し、高速な読み書きとスケーラブルなデータ管理を実現しています。

---

## Service Boundaries / サービス境界

### Provides

* Comment management
* Review management
* Rating management
* User-generated content storage
* Content sanitization
* Social interaction APIs
* Comment retrieval
* Review lifecycle management

### Does Not Handle

* User authentication
* User account management
* Borrow transactions
* Inventory management
* Book catalog management
* Notification delivery
* Analytics aggregation
* Search indexing

---

## Badges

<!-- Code Quality & Tests -->

[![Tests](https://github.com/damouu/library-app-comments/actions/workflows/run-tests.yml/badge.svg)](https://github.com/damouu/library-app-comments/actions/workflows/run-tests.yml)
[![Merge PR](https://github.com/damouu/library-app-comments/actions/workflows/merge-pr.yml/badge.svg)](https://github.com/damouu/library-app-comments/actions/workflows/merge-pr.yml)
[![Prepare](https://github.com/damouu/library-app-comments/actions/workflows/prepare.yml/badge.svg)](https://github.com/damouu/library-app-comments/actions/workflows/prepare.yml)
[![YouTrack-Staging](https://github.com/damouu/library-app-comments/actions/workflows/youtrack-staging.yml/badge.svg)](https://github.com/damouu/library-app-comments/actions/workflows/youtrack-staging.yml)
[![YouTrack Closed](https://github.com/damouu/library-app-comments/actions/workflows/youtrack-done.yml/badge.svg)](https://github.com/damouu/library-app-comments/actions/workflows/youtrack-done.yml)

<!-- Coverage -->

[![Codecov](https://codecov.io/gh/damouu/library-app-comments/graph/badge.svg)](https://codecov.io/gh/damouu/library-app-comments)

<!-- Docker -->

[![Docker Build](https://github.com/damouu/library-app-comments/actions/workflows/build-and-publish.yml/badge.svg)](https://github.com/damouu/library-app-comments/actions/workflows/build-and-publish.yml)
[![Docker Image](https://img.shields.io/docker/v/damou/library-app-comments?label=docker\&logo=docker)](https://hub.docker.com/r/damou/library-app-comments)
[![Docker Pulls](https://img.shields.io/docker/pulls/damou/library-app-comments?logo=docker)](https://hub.docker.com/r/damou/library-app-comments)

<!-- Git / Version -->

[![Git Tag](https://img.shields.io/github/v/tag/damouu/library-app-comments?logo=github)](https://github.com/damouu/library-app-comments/tags)

<!-- Observability -->

![Prometheus](https://img.shields.io/badge/Prometheus-monitored-blue)

---

## Responsibilities / 責務

### English

* Create comments
* Update comments
* Delete comments
* Retrieve comments
* Manage ratings
* Manage reviews
* Sanitize user-generated content
* Maintain comment lifecycle consistency

### 日本語

* コメント作成
* コメント更新
* コメント削除
* コメント取得
* 評価管理
* レビュー管理
* ユーザー投稿内容サニタイズ
* コメントライフサイクル管理

---

## Technology Stack / 技術スタック

| Category         | Technology       |
|------------------|------------------|
| Runtime          | Node.js          |
| Framework        | Express 5        |
| Database         | MongoDB          |
| ODM              | Mongoose         |
| Authentication   | JWT Validation   |
| Validation       | sanitize-html    |
| Monitoring       | Prometheus       |
| Testing          | Jest / Supertest |
| Containerization | Docker           |
| CI/CD            | GitHub Actions   |

---

## API Endpoints / API エンドポイント

### Comment Operations / コメント操作

#### Create Comment

```http
POST /comments
```

Creates a new book review or comment.

書籍に対する新しいコメントを作成します。

---

#### Get Comments

```http
GET /comments
```

Returns stored comments and ratings.

コメントおよび評価情報を取得します。

---

#### Update Comment

```http
PUT /comments/{commentUUID}
```

Updates an existing comment.

既存コメントを更新します。

---

#### Delete Comment

```http
DELETE /comments/{commentUUID}
```

Deletes an existing comment.

既存コメントを削除します。

---

## Processing Flow / 処理フロー

Comment Request

↓

JWT Validation

↓

Content Sanitization

↓

Business Validation

↓

MongoDB Persistence

↓

Response Generation

---

## Comment Lifecycle / コメントライフサイクル

Client Request

↓

Input Validation

↓

Content Sanitization

↓

Database Persistence

↓

Comment Retrieval

↓

User Interaction

---

## API Documentation / API ドキュメント

```text
/api/comments
```

---

## Local Development / ローカル開発

### Requirements

* Node.js
* npm
* Docker
* MongoDB

---

### Run

```bash
npm install

npm run dev
```

---

## Testing / テスト

```bash
npm test
```

### Includes

* Unit tests
* Integration tests
* API tests
* Controller tests
* Repository tests
* Coverage verification

---

### 日本語

含まれるテスト:

* ユニットテスト
* 統合テスト
* API テスト
* コントローラテスト
* Repository テスト
* カバレッジ検証

---

## Build Quality / 品質保証

The CI pipeline enforces:

* Automated test execution
* Coverage thresholds
* Lint validation
* Pull request validation
* Docker image publication
* Branch protection workflows

---

### 日本語

CI パイプラインでは以下を保証します:

* 自動テスト実行
* カバレッジ閾値管理
* Lint 検証
* Pull Request 検証
* Docker イメージ配布
* ブランチ保護ワークフロー

---

## Monitoring / モニタリング

```text
/metrics
```

Prometheus metrics endpoint.

Prometheus メトリクスエンドポイント。

---

## Architectural Role / アーキテクチャ上の役割

The Comments Service represents the social interaction layer of the distributed library system.

It isolates user-generated content from transactional services and allows independent scaling of review and rating
workloads.

---

Comments Service は分散型図書館システムにおけるソーシャルインタラクション層です。

ユーザー生成コンテンツを他サービスから分離することで、レビューや評価機能を独立してスケールさせることができます。

---

## License / ライセンス

MIT
