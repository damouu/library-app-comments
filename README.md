# Library App Comments

概要

図書館管理システムにおけるユーザーのコメントと評価を管理する Node.js/Express マイクロサービスです。MongoDBを使用し、高速な読み書きと柔軟なデータ構造を実現しています。

Overview

The Comments API is a high-performance Node.js microservice built with Express and Mongoose. It handles user reviews, ratings, and social interactions within the library ecosystem, utilizing a non-blocking I/O architecture for high concurrency.

---

## CI/CD Workflow

This repository utilizes a robust automation pipeline to ensure production-grade code quality:

Preparation & Linting: Code formatting and static analysis.

Test Suite: Execution of unit and integration tests (Jest coverage gate).

YouTrack Integration: Automatic status synchronization with project management tools.

Containerization: Automated Docker image builds and push to Docker Hub upon successful merge.

## Badges

[![codecov](https://codecov.io/gh/damouu/library-app-comments/graph/badge.svg?token=JT8T2FV2YT)](https://codecov.io/gh/damouu/library-app-comments)
[![YouTrack-Staging](https://github.com/damouu/library-app-comments/actions/workflows/youtrack-staging.yml/badge.svg)](https://github.com/damouu/library-app-comments/actions/workflows/youtrack-staging.yml)
[![YouTrack-Closed](https://github.com/damouu/library-app-comments/actions/workflows/youtrack-done.yml/badge.svg)](https://github.com/damouu/library-app-comments/actions/workflows/youtrack-done.yml)
[![Tests](https://github.com/damouu/library-app-comments/actions/workflows/run-tests.yml/badge.svg)](https://github.com/damouu/library-app-comments/actions/workflows/run-tests.yml)
[![Prepare](https://github.com/damouu/library-app-comments/actions/workflows/prepare.yml/badge.svg)](https://github.com/damouu/library-app-comments/actions/workflows/prepare.yml)
[![merge](https://github.com/damouu/library-app-comments/actions/workflows/merge-pr.yml/badge.svg)](https://github.com/damouu/library-app-comments/actions/workflows/merge-pr.yml)
[![build-and-publish](https://github.com/damouu/library-app-comments/actions/workflows/build-and-publish.yml/badge.svg)](https://github.com/damouu/library-app-comments/actions/workflows/build-and-publish.yml)

[![Docker Image](https://img.shields.io/docker/v/damou/library-app-auth?label=docker&logo=docker)](https://hub.docker.com/r/damou/library-app-comments)
[![Docker Pulls](https://img.shields.io/docker/pulls/damou/library-app-auth?logo=docker)](https://hub.docker.com/r/damou/library-app-comments)