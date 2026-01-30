# Scalable Job Importer with Queue Processing & Import History Tracking

A backend-driven **scalable job ingestion system** that fetches job listings from multiple external **XML APIs**, processes them asynchronously using **Redis queues and workers**, stores **deduplicated jobs in MongoDB**, and exposes an **admin-facing API** to track detailed import history.

Built with **Node.js, MongoDB, BullMQ, Redis, and Next.js (Admin UI)**.

---

## Overview

This system is designed to handle **high-volume job imports (1M+ records)** while ensuring:

- No duplicate job records
- Reliable background processing
- Fault tolerance with retries
- Clear visibility into every import run

Each cron execution fetches jobs from multiple feeds, queues them for processing, and logs a detailed **import history snapshot** for admin review.

---

## Features

### Job Import
- Fetch jobs from **real external XML APIs**
- Convert XML feeds into JSON
- Normalize and validate job data
- Deduplicate jobs using `(source + externalJobId)`

### Queue & Workers
- Redis-backed queue using **BullMQ**
- Configurable worker concurrency
- Retry logic with failure tracking
- Safe handling of partial failures

### Import History Tracking
- One log per feed per cron run
- Tracks fetched, new, updated, and failed jobs
- Paginated API for admin UI

---

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Redis
- BullMQ
- node-cron

### Frontend
- Next.js (Admin Dashboard)


---

## Job Source APIs

Jobs are fetched from the following XML feeds:

https://jobicy.com/?feed=job_feed

https://jobicy.com/?feed=job_feed&job_categories=data-science

https://jobicy.com/?feed=job_feed&job_categories=business

https://jobicy.com/?feed=job_feed&job_categories=management

https://www.higheredjobs.com/rss/articleFeed.cfm


All feeds return **XML**, which is parsed and converted to JSON before processing.

---

## Cron Job

- Runs **every 1 hour**
- Fetches jobs from all configured feeds
- Creates **one import log per feed per run**

Cron expression:

0 * * * *


---

## Queue Processing

- Each job is pushed into a Redis queue
- Workers consume jobs asynchronously
- Worker concurrency is configurable via environment variables
- Failed jobs are retried and logged with failure reasons

---

## Database Design

### Jobs Collection

Stores all imported job records.

**Deduplication Strategy**
- Compound unique index:
```js
{ source, externalJobId }

Upsert Logic

New job → insert

Existing job with changed hash → update

Existing job with no change → skip

Import Logs Collection (import_logs)

Each document represents one feed execution in one cron run.

Stored fields:

Feed URL

Start timestamp

End timestamp

Total jobs fetched

New jobs created

Jobs updated

Failed jobs with error reasons
---

API Endpoints
Get Import History (Admin UI)

GET /api/v1/history


Query Parameters

| Name  | Default |
| ----- | ------- |
| page  | 1       |
| limit | 20      |


Sample Response

{
  "page": 1,
  "limit": 20,
  "total": 7,
  "data": [
    {
      "feedUrl": "https://jobicy.com/?feed=job_feed",
      "startedAt": "2026-01-30T05:28:00.043Z",
      "totalFetched": 50,
      "newJobs": 50,
      "updatedJobs": 0,
      "failedJobs": [],
      "finishedAt": "2026-01-30T05:28:03.344Z"
    }
  ]
}


Frontend Table Mapping

| UI Column | API Field         |
| --------- | ----------------- |
| File Name | feedUrl           |
| Timestamp | startedAt         |
| Total     | totalFetched      |
| New       | newJobs           |
| Updated   | updatedJobs       |
| Failed    | failedJobs.length |



Setup Instructions
Prerequisites

Node.js v18+

MongoDB (local or Atlas)

Redis (local or Redis Cloud)

cd Backend
npm install

PORT=5000
DB_STRING=
DB_NAME=
REDIS_HOST=127.0.0.1
WORKER_CONCURRENCY=10


Start Redis

redis-server

Verify:

redis-cli ping
# PONG

Start Backend Server

npm start



//  Testing & Verification

Cron execution verified via logs

Import logs validated in MongoDB

Duplicate job prevention verified via repeated cron runs

Pagination tested using /api/v1/history

// Scalability Notes

Queue-based processing supports horizontal scaling

Workers can be scaled independently

MongoDB indexes ensure fast deduplication

Architecture can evolve into microservices if needed

// Assumptions

Import logs are immutable audit records

Duplicate import logs are valid per cron run

Job uniqueness is defined by (source + externalJobId)

External APIs are read-only

// Documentation

System design and architectural decisions are documented in:

/docs/architecture.md


// Author

Pintu Kumar
Full Stack Developer (MERN)

GitHub: https://github.com/pintu1609

LinkedIn: https://www.linkedin.com/in/pintu-kumar-46b147204/