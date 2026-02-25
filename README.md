# ERP Packhouse (Monolite Modulare Multi-tenant)

Monorepo con **1 deploy** e moduli isolati (domain/app/infra/api) per tracciabilità end-to-end ortofrutta.

## Stack
- Backend: NestJS + TypeScript (REST)
- DB: PostgreSQL
- ORM: Prisma
- Frontend: React + TypeScript (Vite)
- Auth: JWT (login/refresh) + RBAC + tenant isolation
- Allegati: metadata DB + storage locale (astratto per S3)

## Struttura repository
```text
erp-packhouse/
  apps/
    api/
    web/
  libs/
    core/
    receiving/
    quality/
    production/
    palletization/
    inventory/
    shipping/
    reporting/
  prisma/
  docker-compose.yml
  .env.example
```

## Regole di dipendenza
- `libs/<modulo>` può importare solo `libs/core` e contratti pubblici in `libs/core/shared/contracts`.
- Vietato l'accesso diretto ai repository/tabelle di altri moduli.
- Integrazione tra moduli via domain events (outbox) e/o contratti pubblici.

## Setup
```bash
cp .env.example .env
docker compose up -d db
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev:api
npm run dev:web
```

## Feature flags per tenant
Tabella `ModuleConfig`:
- `tenantId`
- `moduleCode` (receiving|quality|production|palletization|inventory|shipping|reporting)
- `enabled`

Esempio disabilitazione inventory per tenant:
```sql
update "ModuleConfig"
set enabled = false
where "tenantId" = 'tenant_demo' and "moduleCode" = 'inventory';
```

## Eventi + Outbox + Audit
Ogni command handler critico deve:
1. aprire transazione
2. applicare modifica write-side
3. scrivere `AuditLog` (who/when/before/after/reason)
4. scrivere `OutboxMessage`
5. commit

`OutboxProcessor` pubblica inizialmente su bus in-memory/log; estendibile a webhook o broker.

## API MVP (payload esempio)
### Auth
`POST /auth/login`
```json
{ "email": "admin@tenant.it", "password": "Password123" }
```

`POST /auth/refresh`
```json
{ "refreshToken": "refresh-token" }
```

### Masterdata
`POST /masterdata/products`
```json
{ "name": "Pomodoro Datterino", "gtin": "08012345678903" }
```

`POST /masterdata/pack-specs`
```json
{ "productId": "prod_1", "description": "Cassetta 5kg" }
```

`POST /masterdata/parties`
```json
{ "type": "SUPPLIER", "name": "Azienda Agricola Rossi" }
```

### Receiving
`POST /receiving/inbound-lots`
```json
{ "tenantId": "tenant_demo", "actorUserId": "user_1", "lotCode": "ING-2026-0001", "productId": "prod_1" }
```

`POST /receiving/weights`
```json
{ "tenantId": "tenant_demo", "actorUserId": "user_1", "lotId": "lot_1", "grossKg": 520.5, "tareKg": 20.5 }
```

### Quality
`POST /quality/qc-checks`
```json
{ "tenantId": "tenant_demo", "targetId": "lot_1", "outcome": "PASS" }
```

`POST /quality/hold`
```json
{ "tenantId": "tenant_demo", "targetId": "lot_1", "reason": "Residuo fitosanitario" }
```

### Production
`POST /production/sessions/start`, `/production/sessions/end`, `/production/consume`, `/production/output`, `/production/scrap`

### Palletization
`POST /palletization/pallets`
```json
{ "tenantId": "tenant_demo", "sscc": "003801234500000000" }
```

### Shipping
`POST /shipping/shipments`, `/shipping/shipments/assign-pallets`, `/shipping/shipments/dispatch`

### Reporting
`GET /reporting/traceability/forward?tenantId=tenant_demo&lotCode=ING-2026-0001`

`GET /reporting/traceability/backward?tenantId=tenant_demo&shipmentId=ship_1`

## Moduli frontend MVP
- Login
- Dashboard
- Ricezione
- QC
- Produzione
- Pallet
- Spedizioni
- Tracciabilità

## Roadmap
- Phase 2: RLS Postgres, broker eventi, stampa etichette ZPL reale, read-model incrementale avanzato.

## Deploy semplice e gratuito (step-by-step)
Scelta consigliata MVP: **Render (web service free) + Neon (Postgres free)** con **un solo deploy**.

### 1) Crea il database gratuito su Neon
1. Vai su Neon e crea un progetto gratuito.
2. Crea database `erp_packhouse`.
3. Copia la connection string PostgreSQL (`DATABASE_URL`).

### 2) Pubblica il repository su GitHub
1. Push del repo su GitHub.
2. Verifica che siano presenti `Dockerfile` e `render.yaml` in root.

### 3) Crea il servizio gratuito su Render
1. Vai su Render → **New +** → **Blueprint**.
2. Collega il repository GitHub.
3. Render leggerà `render.yaml` e creerà il servizio `erp-packhouse`.
4. In Render → Environment imposta `DATABASE_URL` con il valore di Neon.
5. Avvia il deploy.

### 4) Verifica post-deploy
- Health check: `GET https://<tuo-servizio>.onrender.com/api/health`
- Login: `POST https://<tuo-servizio>.onrender.com/auth/login`
- Frontend: `https://<tuo-servizio>.onrender.com/`

### 5) Limiti piano free (normali)
- Lo spin-down del servizio dopo inattività è previsto.
- Primo avvio dopo sleep può richiedere alcuni secondi.

### 6) Migrazioni Prisma in produzione
Nel MVP corrente il deploy è scaffold-first. Quando colleghi Prisma runtime:
1. aggiungi `prisma migrate deploy` nello startup command, oppure
2. esegui una one-off job su Render dopo ogni migration.

Suggerimento: per semplicità iniziale puoi fare deploy senza migrazioni automatiche, poi abilitarle in Phase 2.


### 7) Troubleshooting rapido (Render)
- Errore `Cannot find module /app/apps/api/dist/main.js`:
  - assicurati di usare il `Dockerfile` aggiornato di questo repo (entrypoint: `node apps/api/dist/apps/api/src/main.js`).
- Errore `Cannot find module '@core/identity/identity.api.module'`:
  - il progetto ora usa import relativi runtime-safe nei moduli Nest; fai redeploy dell'immagine aggiornata.
- Se l'homepage è bianca o 404:
  - verifica che il build web venga copiato in `apps/api/public` durante la build docker.
- Se le API rispondono 401:
  - aggiungi header `x-tenant-id` per tutti gli endpoint business (eccetto `/auth/*` e `/api/health`).
