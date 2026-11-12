# Library App Comments Service

Distributed Library System — Comments Service

---

## Overview

The Comments Service is responsible for managing user-generated content within the distributed library platform.

It allows users to create, retrieve, update, and delete book reviews, ratings, and comments while maintaining content validation and sanitization rules.

Built with Node.js and Express, the service leverages MongoDB's flexible document model to efficiently store and retrieve social interaction data at scale.

---

## Service Boundaries

### Provides

- Comment management
- Review management
- Rating management
- User-generated content storage
- Content sanitization
- Social interaction APIs
- Comment retrieval
- Review lifecycle management

### Does Not Handle

- User authentication
- User account management
- Borrow transactions
- Inventory management
- Book catalog management
- Notification delivery
- Analytics aggregation
- Search indexing

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
[![Docker Image](https://img.shields.io/docker/v/damou/library-app-comments?label=docker&logo=docker)](https://hub.docker.com/r/damou/library-app-comments)
[![Docker Pulls](https://img.shields.io/docker/pulls/damou/library-app-comments?logo=docker)](https://hub.docker.com/r/damou/library-app-comments)

<!-- Git / Version -->

[![Git Tag](https://img.shields.io/github/v/tag/damouu/library-app-comments?logo=github)](https://github.com/damouu/library-app-comments/tags)

<!-- Observability -->

![Prometheus](https://img.shields.io/badge/Prometheus-monitored-blue)

---

## Responsibilities

- Create comments
- Update comments
- Delete comments
- Retrieve comments
- Manage ratings
- Manage reviews
- Sanitize user-generated content
- Maintain comment lifecycle consistency

---

## Technology Stack

| Category         | Technology       |
|------------------|------------------|
| Runtime          | Node.js          |
| Framework        | Express 5        |
| Database         | MongoDB          |
| ODM              | Mongoose         |
| Authentication  | JWT Validation   |
| Validation       | sanitize-html    |
| Monitoring       | Prometheus       |
| Testing          | Jest / Supertest |
| Containerization | Docker           |
| CI/CD            | GitHub Actions   |

---

## API Endpoints

### Comment Operations

#### Create Comment

```http
POST /comments
```

Creates a new book review or comment.

---

#### Get Comments

```http
GET /comments
```

Returns stored comments and ratings.

---

#### Update Comment

```http
PUT /comments/{commentUUID}
```

Updates an existing comment.

---

#### Delete Comment

```http
DELETE /comments/{commentUUID}
```

Deletes an existing comment.

---

## Processing Flow

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

## Comment Lifecycle

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

## API Documentation

```text
/api/comments
```

---

## Build Quality

The CI pipeline enforces:

- Automated test execution
- Coverage thresholds
- Lint validation
- Pull request validation
- Docker image publication
- Branch protection workflows

---

## Monitoring

```text
/metrics
```

Prometheus metrics endpoint.

---

## Architectural Role

The Comments Service represents the social interaction layer of the distributed library system.

It isolates user-generated content from transactional services and allows independent scaling of review and rating workloads.

---

## License

MIT
