# Imbee Test NestJS - Firebase Notification Service

A NestJS microservice application for handling Firebase Cloud Messaging (FCM) notifications using RabbitMQ for event-driven architecture.

## Prerequisites

- Docker & Docker Compose
- Firebase Project (for FCM setup)

## Project Structure

```
src/
├── app.controller.ts          # Main API controller
├── app.module.ts              # Root module
├── app.service.ts             # App service
├── main.ts                     # Application entry point
├── configs/
│   ├── config.service.ts       # Configuration service
│   └── rabbitmq.config.ts      # RabbitMQ configuration
├── notification/
│   ├── notification.controller.ts  # Event pattern handler
│   ├── notification.module.ts      # Notification module
│   ├── notification.service.ts     # Notification business logic
│   └── databases/
│       └── fcm_job.entity.ts       # FCM Job entity
└── databases/
    └── fcm_job.entity.ts       # Database entities
serviceAccountKey.json         # Firebase service account key (not committed)
```

## Quick Start with Docker Compose

### 1. Clone Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Or create a `.env` file with the following configuration:

```dotenv
# Timezone
TZ=Asia/Jakarta

# MySQL
MYSQL_HOST=db
MYSQL_PORT=3306
MYSQL_ROOT_PASSWORD=rootpassword_imbee
MYSQL_DATABASE=imbee_nest_db
MYSQL_USER=app_user_imbee
MYSQL_PASSWORD=app_password_imbee

# RabbitMQ
RABBITMQ_PORT=5672
RABBITMQ_MANAGEMENT_PORT=15672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest
RABBITMQ_VHOST=/
```

### 2. Start the Services

Build and start all services:

```bash
# Start all services in the background
docker compose up -d

# Or start with logs
docker compose up

# View logs
docker compose logs -f app

# Stop services
docker compose down

# Stop and remove volumes (clean slate)
docker compose down -v
```

## Services Overview

### MySQL (db)

- Image: `mysql:8.0`
- Stores FCM job records and notification history
- Healthcheck: Active

### RabbitMQ (rabbitmq)

- Image: `rabbitmq:3.13-management`
- Event broker for async messaging
- Management UI on port 15672
- Healthcheck: Active

### NestJS App (app)

- Runs the microservice
- Connects to MySQL and RabbitMQ
- Waits for both services to be healthy before starting

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name and follow the setup wizard
4. Enable Firebase Cloud Messaging (FCM)

### 2. Generate Service Account Key

1. In Firebase Console, go to **Settings** → **Service Accounts**
2. Click **Generate New Private Key**
3. Save the JSON file securely

### 3. Setup Service Account Key File (Recommended)

The recommended approach is to store the entire service account JSON file in your project:

1. **Copy the service account key file to the project root:**

   ```bash
   # From Firebase Console, download the JSON file
   # Save it in the project root:
   cp /path/to/serviceAccountKey.json ./serviceAccountKey.json
   ```

2. **Verify the file structure:**

   ```bash
   cat serviceAccountKey.json
   ```

   Should contain:

   ```json
   {
     "type": "service_account",
     "project_id": "your-project-id",
     "private_key_id": "key-id",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
     "client_email": "firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com",
     "client_id": "000000000000000000000",
     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
     "token_uri": "https://oauth2.googleapis.com/token",
     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
     "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
   }
   ```

3. **Add to `.gitignore` to never commit credentials:**

   ```
   serviceAccountKey.json
   ```

4. **Update your app code to load the file:**

   In your notification service, load the service account key:

   ```typescript
   import * as admin from 'firebase-admin';
   import * as fs from 'fs';

   // Load service account key
   const serviceAccount = JSON.parse(
     fs.readFileSync('./serviceAccountKey.json', 'utf-8'),
   );

   // Initialize Firebase Admin SDK
   admin.initializeApp({
     credential: admin.credential.cert(serviceAccount),
     projectId: serviceAccount.project_id,
   });
   ```

## API Usage

### Send Notification

**Endpoint:** `POST /`

**Request Body:**

```json
{
  "content": "Your notification message",
  "device_id": "target_device_token"
}
```

**Example:**

```bash
curl -X POST http://localhost:3000 \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello from FCM!","device_id":"e1BgrL1uJ5jj..."}'
```

**Response:**

```json
{
  "status": "Message sent to notification service",
  "data": {
    "content": "Hello from postman",
    "device_id": "e1BgrL1uJ5jj..."
  }
}
```

## Event Flow

1. **API Request** → POST to `/` with notification content
2. **Event Emit** → AppController emits `notification.fcm.send` event to RabbitMQ
3. **Queue Processing** → Message stored in `notification.fcm` queue
4. **Event Handler** → NotificationController consumes the event
5. **FCM Send** → NotificationService sends notification via Firebase
6. **Database Save** → Job record saved to MySQL
7. **Done Event** → NotificationService emits `notification.done` event after successful processing

## License

This project is licensed under the MIT License - see the LICENSE file for details.
