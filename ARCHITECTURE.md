# ASM-Studio Pro - System Architecture

## Overview

ASM-Studio Pro is a cloud-based IDE for MASM 16-bit 8086 assembly language with an AI-powered teaching assistant. The system is designed for scalability, maintainability, and educational effectiveness.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │  Mobile App  │  │  VS Code Ext │      │
│  │   (React)    │  │ (React Native│  │  (Extension) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Load Balancer (NGINX)                               │   │
│  │  - SSL Termination                                   │   │
│  │  - Rate Limiting                                     │   │
│  │  - Request Routing                                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│   Application Layer     │   │   WebSocket Layer       │
│  ┌──────────────────┐   │   │  ┌──────────────────┐   │
│  │  REST API        │   │   │  │  Real-time Collab│   │
│  │  (Express.js)    │   │   │  │  (Socket.io)     │   │
│  │                  │   │   │  │                  │   │
│  │ - Auth           │   │   │  │ - Live Cursors   │   │
│  │ - Code CRUD      │   │   │  │ - Code Sync      │   │
│  │ - User Mgmt      │   │   │  │ - Chat           │   │
│  │ - Analytics      │   │   │  │ - Notifications  │   │
│  └──────────────────┘   │   │  └──────────────────┘   │
└─────────────────────────┘   └─────────────────────────┘
                │                           │
                └─────────────┬─────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Business Logic Layer                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  AI Engine   │  │  Compiler    │  │  Executor    │      │
│  │  (Gemini)    │  │  (MASM)      │  │  (8086 Sim)  │      │
│  │              │  │              │  │              │      │
│  │ - Code       │  │ - Syntax     │  │ - Step-by-   │      │
│  │   Analysis   │  │   Validation │  │   step Exec  │      │
│  │ - Explain    │  │ - Symbol     │  │ - Register   │      │
│  │ - Optimize   │  │   Table      │  │   Tracking   │      │
│  │ - Debug      │  │ - Code Gen   │  │ - Memory Sim │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│     Data Layer          │   │   Cache Layer           │
│  ┌──────────────────┐   │   │  ┌──────────────────┐   │
│  │  MongoDB         │   │   │  │  Redis           │   │
│  │                  │   │   │  │                  │   │
│  │ - Users          │   │   │  │ - Sessions       │   │
│  │ - Code Files     │   │   │  │ - Execution      │   │
│  │ - Projects       │   │   │  │   Results        │   │
│  │ - Classes        │   │   │  │ - AI Responses   │   │
│  │ - Assignments    │   │   │  │ - Rate Limits    │   │
│  └──────────────────┘   │   │  └──────────────────┘   │
└─────────────────────────┘   └─────────────────────────┘
```

---

## Component Details

### 1. Frontend (React + TypeScript)

**Technology Stack**:
- React 18 with TypeScript
- Monaco Editor (VS Code engine)
- TailwindCSS + shadcn/ui
- Zustand (state management)
- React Query (data fetching)
- Socket.io-client (real-time)

**Key Components**:

```
frontend/src/
├── components/
│   ├── Editor/
│   │   ├── CodeEditor.tsx          # Monaco editor wrapper
│   │   ├── Toolbar.tsx              # Editor toolbar
│   │   └── StatusBar.tsx            # Status indicators
│   ├── Execution/
│   │   ├── ExecutionPanel.tsx       # Execution output
│   │   ├── RegisterView.tsx         # CPU registers
│   │   ├── MemoryView.tsx           # Memory visualization
│   │   └── FlagsView.tsx            # CPU flags
│   ├── Debugger/
│   │   ├── BreakpointPanel.tsx      # Breakpoint management
│   │   ├── WatchPanel.tsx           # Watch expressions
│   │   └── CallStackView.tsx        # Call stack
│   ├── AI/
│   │   ├── AIAssistant.tsx          # AI chat interface
│   │   └── ExplanationPanel.tsx     # Code explanations
│   └── Collaboration/
│       ├── LiveCursors.tsx          # Real-time cursors
│       └── ChatPanel.tsx            # Team chat
├── pages/
│   ├── Editor.tsx                   # Main editor page
│   ├── Dashboard.tsx                # User dashboard
│   ├── Classroom.tsx                # Instructor view
│   └── Tutorials.tsx                # Learning resources
├── hooks/
│   ├── useAI.ts                     # AI integration
│   ├── useExecution.ts              # Code execution
│   └── useCollaboration.ts          # Real-time sync
└── lib/
    ├── api.ts                       # API client
    ├── websocket.ts                 # WebSocket client
    └── utils.ts                     # Utilities
```

---

### 2. Backend (Node.js + Express)

**Technology Stack**:
- Node.js 18+ with TypeScript
- Express.js (REST API)
- Socket.io (WebSocket)
- MongoDB (database)
- Redis (caching)
- JWT (authentication)

**Key Modules**:

```
backend/src/
├── routes/
│   ├── auth.routes.ts               # Authentication
│   ├── code.routes.ts               # Code CRUD
│   ├── execution.routes.ts          # Code execution
│   ├── ai.routes.ts                 # AI interactions
│   ├── classroom.routes.ts          # Class management
│   └── analytics.routes.ts          # Usage analytics
├── controllers/
│   ├── AuthController.ts
│   ├── CodeController.ts
│   ├── ExecutionController.ts
│   ├── AIController.ts
│   └── ClassroomController.ts
├── services/
│   ├── AIService.ts                 # AI engine integration
│   ├── CompilerService.ts           # MASM compilation
│   ├── ExecutorService.ts           # 8086 simulation
│   ├── CacheService.ts              # Redis caching
│   └── EmailService.ts              # Email notifications
├── models/
│   ├── User.model.ts
│   ├── Code.model.ts
│   ├── Project.model.ts
│   ├── Classroom.model.ts
│   └── Assignment.model.ts
├── middleware/
│   ├── auth.middleware.ts           # JWT validation
│   ├── rateLimit.middleware.ts      # Rate limiting
│   ├── validation.middleware.ts     # Input validation
│   └── error.middleware.ts          # Error handling
└── websocket/
    ├── collaboration.handler.ts     # Real-time collab
    └── notifications.handler.ts     # Push notifications
```

---

### 3. AI Engine (Gemini Integration)

**Core Responsibilities**:
1. Load and manage system prompts
2. Process assembly code with AI
3. Provide educational explanations
4. Generate optimization suggestions
5. Interactive debugging assistance

**Key Files**:

```
ai-engine/src/
├── index.ts                         # Main AI engine
├── prompts/
│   ├── loader.ts                    # Prompt loading
│   └── manager.ts                   # Prompt management
├── compiler/
│   ├── lexer.ts                     # Tokenization
│   ├── parser.ts                    # Syntax parsing
│   ├── validator.ts                 # Validation
│   └── symbolTable.ts               # Symbol management
├── executor/
│   ├── cpu.ts                       # 8086 CPU simulation
│   ├── memory.ts                    # Memory management
│   ├── registers.ts                 # Register state
│   └── instructions.ts              # Instruction set
└── debugger/
    ├── breakpoints.ts               # Breakpoint management
    ├── stepping.ts                  # Step execution
    └── watches.ts                   # Watch expressions
```

---

## Data Flow

### Code Execution Flow

```
1. User writes code in Monaco Editor
   ↓
2. Frontend sends code to Backend API
   POST /api/execution/run
   ↓
3. Backend validates request
   - Check authentication
   - Rate limiting
   - Input validation
   ↓
4. Backend forwards to AI Engine
   - Load system prompts
   - Create AI context
   ↓
5. AI Engine processes code
   a. Compile (validate syntax, build symbol table)
   b. Execute (simulate 8086 step-by-step)
   c. Format output (use templates)
   ↓
6. AI returns formatted response
   - Build output
   - Execution trace
   - Final state
   ↓
7. Backend caches result (Redis)
   - Key: code hash
   - TTL: 1 hour
   ↓
8. Backend sends response to Frontend
   ↓
9. Frontend displays results
   - Syntax highlighting
   - Register visualization
   - Memory view
```

### Real-time Collaboration Flow

```
1. User A edits code
   ↓
2. Frontend emits WebSocket event
   socket.emit('code:change', { delta, cursor })
   ↓
3. Backend broadcasts to room
   socket.to(roomId).emit('code:change', data)
   ↓
4. User B receives update
   ↓
5. Frontend applies delta
   - Update Monaco editor
   - Show User A's cursor
```

---

## Database Schema

### MongoDB Collections

**users**
```typescript
{
  _id: ObjectId,
  email: string,
  password: string (hashed),
  name: string,
  role: 'student' | 'instructor' | 'admin',
  createdAt: Date,
  lastLogin: Date,
  settings: {
    theme: 'light' | 'dark',
    fontSize: number,
    aiMode: 'standard' | 'fast' | 'teach'
  }
}
```

**codes**
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  title: string,
  code: string,
  language: 'masm',
  projectId?: ObjectId,
  isPublic: boolean,
  shareLink?: string,
  createdAt: Date,
  updatedAt: Date,
  executionResults?: {
    output: string,
    registers: object,
    memory: object,
    timestamp: Date
  }
}
```

**projects**
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  name: string,
  description: string,
  files: [ObjectId], // references to codes
  createdAt: Date,
  updatedAt: Date
}
```

**classrooms**
```typescript
{
  _id: ObjectId,
  instructorId: ObjectId,
  name: string,
  code: string, // join code
  students: [ObjectId],
  assignments: [ObjectId],
  createdAt: Date
}
```

**assignments**
```typescript
{
  _id: ObjectId,
  classroomId: ObjectId,
  title: string,
  description: string,
  starterCode: string,
  testCases: [{
    input: object,
    expectedOutput: object,
    points: number
  }],
  dueDate: Date,
  submissions: [{
    studentId: ObjectId,
    code: string,
    score: number,
    submittedAt: Date
  }]
}
```

---

## Caching Strategy

### Redis Cache Keys

```
# Session management
session:{sessionId} → user data (TTL: 7 days)

# Execution results
exec:{codeHash} → execution output (TTL: 1 hour)

# AI responses
ai:{promptHash} → AI response (TTL: 24 hours)

# Rate limiting
ratelimit:{userId}:{endpoint} → request count (TTL: 15 min)

# Real-time collaboration
room:{roomId}:users → active users (TTL: none)
room:{roomId}:code → current code state (TTL: none)
```

---

## Security

### Authentication Flow

1. **Registration**: Email + password → bcrypt hash → store in DB
2. **Login**: Verify password → generate JWT → return token
3. **Authorization**: JWT in header → verify → attach user to request

### JWT Structure

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "role": "student",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Security Measures

- ✅ HTTPS only (SSL/TLS)
- ✅ JWT with short expiration (7 days)
- ✅ Password hashing (bcrypt, 10 rounds)
- ✅ Rate limiting (100 req/15min per user)
- ✅ Input validation (Joi schemas)
- ✅ SQL injection prevention (MongoDB parameterized queries)
- ✅ XSS prevention (sanitize inputs)
- ✅ CORS configuration (whitelist origins)
- ✅ Helmet.js (security headers)

---

## Scalability

### Horizontal Scaling

```
┌──────────────┐
│ Load Balancer│
└──────┬───────┘
       │
   ┌───┴───┬───────┬───────┐
   ▼       ▼       ▼       ▼
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│API 1│ │API 2│ │API 3│ │API N│
└─────┘ └─────┘ └─────┘ └─────┘
   │       │       │       │
   └───┬───┴───┬───┴───┬───┘
       ▼       ▼       ▼
    ┌──────┐ ┌──────┐
    │MongoDB│ │Redis │
    └──────┘ └──────┘
```

### Performance Optimizations

1. **Caching**: Redis for frequently accessed data
2. **CDN**: Static assets served from CDN
3. **Code Splitting**: Lazy load React components
4. **Database Indexing**: Index on userId, email, createdAt
5. **Connection Pooling**: MongoDB connection pool (max 100)
6. **Compression**: Gzip responses
7. **Pagination**: Limit query results (max 50 per page)

---

## Monitoring & Logging

### Metrics to Track

- **Performance**: Response time, throughput, error rate
- **Usage**: Active users, code executions, AI requests
- **Resources**: CPU, memory, disk, network
- **Business**: User signups, retention, engagement

### Logging Strategy

```typescript
// Structured logging with Winston
logger.info('Code executed', {
  userId: '507f1f77bcf86cd799439011',
  codeId: '507f1f77bcf86cd799439012',
  executionTime: 45, // ms
  steps: 8,
  success: true
});
```

### Tools

- **Monitoring**: Prometheus + Grafana
- **Logging**: Winston + ELK Stack (Elasticsearch, Logstash, Kibana)
- **Error Tracking**: Sentry
- **APM**: New Relic / DataDog

---

## Deployment

### CI/CD Pipeline

```
1. Developer pushes code to GitHub
   ↓
2. GitHub Actions triggers
   ↓
3. Run tests (unit, integration, e2e)
   ↓
4. Build Docker images
   ↓
5. Push to Docker Registry
   ↓
6. Deploy to Kubernetes
   - Rolling update
   - Health checks
   ↓
7. Run smoke tests
   ↓
8. Notify team (Slack)
```

### Kubernetes Deployment

```yaml
# Simplified K8s structure
- Namespace: asmstudio-prod
  - Deployment: backend (3 replicas)
  - Deployment: frontend (2 replicas)
  - Deployment: ai-engine (2 replicas)
  - StatefulSet: mongodb (3 replicas)
  - Deployment: redis (1 replica)
  - Service: LoadBalancer (external)
  - Ingress: NGINX (SSL termination)
```

---

## Future Enhancements

### Phase 2: Advanced Features

1. **Multi-language Support**: NASM, TASM, GAS
2. **Hardware Simulation**: VGA, keyboard, timer interrupts
3. **32/64-bit Mode**: Support for protected mode
4. **Mobile Apps**: iOS and Android native apps
5. **VS Code Extension**: Edit locally, execute in cloud

### Phase 3: Enterprise

1. **SSO Integration**: SAML, OAuth2
2. **LMS Integration**: Canvas, Moodle, Blackboard
3. **Custom Branding**: White-label solution
4. **On-premise**: Self-hosted version
5. **Advanced Analytics**: ML-powered insights

---

**END OF ARCHITECTURE DOCUMENT**
