# System Architecture – Scalable Job Importer

## 1. Overview

This system is designed to **reliably ingest large volumes of job data** from multiple external XML-based APIs, process them asynchronously using a queue-based architecture, store deduplicated records in MongoDB, and maintain a detailed **import history audit trail**.

The architecture focuses on:
- Scalability
- Fault tolerance
- Clear separation of responsibilities
- Future extensibility (microservices-ready)

---

## 2. High-Level Architecture

```mermaid
graph TD
    %% Styles
    classDef external fill:#f9f,stroke:#333,stroke-width:2px;
    classDef infra fill:#eee,stroke:#333,stroke-width:2px,stroke-dasharray: 5 5;
    classDef app fill:#cce6ff,stroke:#005c99,stroke-width:2px;
    classDef worker fill:#ffebcc,stroke:#ff9900,stroke-width:2px;

    %% External Systems
    subgraph External_Sources [External Job Sources]
        direction LR
        Jobicy["Jobicy API\n(XML/RSS)"]:::external
    end

    %% Infrastructure
    subgraph Infrastructure [Data & Queues]
        Redis[(Redis\nBullMQ Store)]:::infra
        Mongo[(MongoDB)]:::infra
        
        subgraph Collections [DB Collections]
            JobsColl[Jobs Collection]
            LogsColl["Import Logs\n(History Tracking)"]
        end
    end

    %% Backend Services
    subgraph Backend [Node.js Backend System]
        Cron["Cron Scheduler\n(Every 1 Hour)"]:::app
        
        subgraph Producer_Service [Producer Service]
            Fetcher[API Fetcher]:::app
            Parser[XML to JSON Parser]:::app
            QueueProd[Queue Producer]:::app
        end

        subgraph Consumer_Service [Worker Service - Scalable]
            Worker["Job Worker\n(Concurrency Controlled)"]:::worker
            UpsertLogic["Upsert Logic\n(updateMany / bulkWrite)"]:::worker
        end
        
        APIGateway[API Gateway / Admin Endpoints]:::app
    end

    %% Frontend
    subgraph Frontend_Client [Client Side]
        NextJS[Next.js Admin UI]:::app
        User((Admin User)):::app
    end

    %% Relationships & Data Flow
    
    %% 1. Trigger & Fetch
    Cron -- 1. Trigger --> Fetcher
    Fetcher -- 2. HTTP GET --> Jobicy
  
    Jobicy  -- 3. Return XML --> Parser
    
    %% 2. Parse & Queue
    Parser -- 4. Normalized JSON --> QueueProd
    QueueProd -- 5. Add Job (Batched) --> Redis
    
    %% 3. Process
    Redis -- 6. Poll/Process Job --> Worker
    Worker --> UpsertLogic
    
    %% 4. Persistence
    UpsertLogic -- 8. Write/Update --> JobsColl
    UpsertLogic -- 9. Update Stats (New/Failed/Total) --> LogsColl
    
    %% 5. Monitoring
    User -- View History --> NextJS
    NextJS -- REST --> APIGateway
    APIGateway -- Query Logs --> LogsColl
    
    %% Connections between infrastructure
    JobsColl -.-> Mongo
    LogsColl -.-> Mongo

    %% Annotations for Scale
    linkStyle 7 stroke:#ff9900,stroke-width:2px;
    linkStyle 8 stroke:#ff9900,stroke-width:2px;
```

---

## 3. Core Components

### 3.1 Cron Scheduler

- Uses **node-cron**
- Runs every **1 hour**
- Responsible only for:
  - Triggering feed fetch
  - Creating import log entries
  - Enqueuing jobs

> Cron does NOT perform heavy processing.  
> This prevents blocking and improves reliability.

---

### 3.2 Feed Fetch Service

Responsibilities:
- Fetch XML data from external APIs
- Convert XML → JSON
- Normalize job payload
- Create one **import log per feed per run**
- Push each job into Redis queue

Design choice:
- Fetching and processing are separated to keep the cron lightweight.

---

### 3.3 Redis Queue (BullMQ)

Why BullMQ:
- High throughput
- Redis-backed persistence
- Built-in retry & backoff
- Supports concurrency

Queue behavior:
- Each job record becomes one queue task
- Retry attempts configurable
- Failed jobs are logged into import history

---

### 3.4 Worker System

- Workers consume jobs from Redis
- Concurrency controlled via environment variable
- Each worker:
  - Validates job payload
  - Performs MongoDB upsert
  - Updates import log counters

Failure handling:
- Duplicate key errors are safely ignored
- Unexpected errors are recorded in `failedJobs`

---

## 4. MongoDB Design

### 4.1 Jobs Collection

Purpose:
- Store deduplicated job records

Deduplication strategy:
```js
{ source, externalJobId }

db.jobs.createIndex(
  { source: 1, externalJobId: 1 },
  { unique: true }
)
```
## Update logic:

New job → insert

Existing job with changed hash → update

Existing job with same hash → skip

This ensures idempotent imports, even with repeated cron runs.

## 4.2 Import Logs Collection (importlogs)

Purpose:

Full audit trail of every import execution

One document is created:

Per feed

Per cron run

Fields:

feedUrl

startedAt

finishedAt

totalFetched

newJobs

updatedJobs

failedJobs[]