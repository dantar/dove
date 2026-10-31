# DOVE Project Reference

## Purpose

DOVE is a mobile-first warehouse-management web application. QR codes identify warehouse locations (`posto`) and inventory items (`oggetto`), so staff can scan a code to browse, place, update, photograph, move, delete, or check out stock. It also includes schema-defined item metadata, label printing, and an older order/client backend feature whose UI is not currently present.

This file is the working orientation guide for future sessions. It describes the repository as inspected on 2026-10-02; update it when features, deployment behavior, or architecture changes.

## Architecture

Four Docker services implement the application:

| Service | Technology | Responsibility |
| --- | --- | --- |
| `frontend` | Pre-built Vue SPA served by nginx | Mobile/laptop UI, camera and QR access, runtime endpoint configuration. |
| `backend` | Java 21, Spring Boot 3.3.4 | REST API, JWT-cookie authentication, JPA data access, dynamic search, and filesystem image management. |
| `database` | PostgreSQL 18 with `ltree` | Persistent relational data, JSONB schemas and metadata, hierarchy support. |
| `flyway` | Flyway 11 | Applies incremental schema migrations after the database is healthy. |

The production reverse proxy is a separate SWAG/nginx installation on the same host (`/opt/swag`). `dove.dantar.it` proxies `/` to `frontend:80` and `/backend/` to `backend:8080` over the external `proxy` Docker network; `/images/` is served directly from the backend image directory, mounted read-only into SWAG. The SPA therefore uses relative production URLs: `/backend` and `/images`.

## Repository Layout

| Path | Contents and status |
| --- | --- |
| `dove-vue/` | Active Vue frontend source, build configuration, and its development Dockerfile. |
| `dove-rest/` | Active Spring Boot backend Maven project and Dockerfile. `target/` is generated output. |
| `database/` | Active PostgreSQL image and first-boot schema/seed scripts. |
| `flyway/sql/` | Active incremental migrations. |
| `deploy/` | Production artifact-based Docker build contexts, the compose file mirrored from the server, reference copies of the SWAG compose file and `dove.conf` site config, and a database tunnel helper. |
| `scripts/` | Build, deploy, database tunnel, and legacy initialization/deployment scripts. |
| `docker/` | Older local compose setup; see development notes for its migration-volume issue. |
| `sql/` | Historical/manual schema dumps and SQL, not the active initialization/migration source. |
| `postman/collection.json` | Small, outdated Postman collection for login and location checks. |
| `resources/` | SVG logos and a one-line product TODO. |

Repository history is active through the checkout UI work. Untracked files at inspection time include `resources/todo.txt`, `scripts/init-db.sh`, `scripts/obsolete-deploy-prod.sh`, `sql/init-db.sql`, and `docker/images/`; treat their version-control status deliberately before committing.

## Containers and Runtime

### Production deployment

Production runs on the `dantar` host (SSH alias in `~/.ssh/config`) as compose project `dove` in `/opt/web/dove`. `scripts/deploy-dove.sh` copies `deploy/*` (except `swag/`) there, then the artifacts built by `scripts/build-dove.sh` (`dove-vue/dist/` into `frontend/dist`, `dove-rest/target/dove-rest.jar` into `backend/`), `database/init/` and `flyway/sql/`. `deploy/docker-compose.yml` overwrites the live compose file, so it must stay identical to the server's.

- Networks: `frontend` and `backend` join the external `proxy` network shared with SWAG; `backend`, `database`, and `flyway` share the project network `dove` (`dove_dove`). No host ports are published.
- Frontend: nginx on port 80; runtime config is generated from `config.template.json` using `APP_URL`, `BACKEND_URL`, and `IMAGES_URL`.
- Backend: port 8080, Actuator port 8081 internal; waits for PostgreSQL health and successful Flyway migration; images at host `backend/data/images` (mounted as `/data`), logs at `backend/data/logs`.
- Database: internal port 5432, data at host `database/data/postgresql`, dumps folder `database/dbdump` mounted as `/dbdump`, one-time scripts mounted at `/docker-entrypoint-initdb.d`.
- Flyway: uses `baselineOnMigrate=true`, then applies every `flyway/sql/V*` file.
- A placeholder `nginx` service (`container_name: dove`) serves `/opt/web/dove/html`; SWAG does not route to it.
- `deploy/export-ports.sh` exposes the internal production database through an ephemeral socat container on `dove_dove`. `scripts/db.sh` does the same and creates the SSH tunnel to `localhost:25432`.

### Local development

- Frontend needs Node `^20.19.0 || >=22.12.0`; use `npm run dev`, `npm run build`, `npm run lint`, or `npm run preview` from `dove-vue/`.
- Backend is Maven-based; `mvn clean package` from `dove-rest/` produces the jar consumed by Docker.
- `docker/docker-compose.yml` is an older local stack on ports 9180/9181 and PostgreSQL 15432. Its Flyway volume is `./flyway/sql`, relative to `docker/`, although migrations are stored at repository-root `flyway/sql`; migrations will not mount unless the compose file or directory layout is corrected.
- The deployment Dockerfiles in `deploy/` consume already-built artifacts. The component Dockerfiles in `dove-vue/` and `dove-rest/` are separate alternatives; the frontend one builds itself, while the backend one also copies a prebuilt jar.

## Frontend

### Stack and configuration

- Vue 3.5 Composition API, TypeScript 5.9, Vite 7, Vue Router 4, Pinia 3, Axios, Sass, `html5-qrcode`, `qrcode.vue`, DiceBear, and UUID v4.
- `src/main.ts` fetches `/config.json` before mounting the application. Axios is configured with `withCredentials`, so the backend's JWT cookie is used.
- Vite aliases `@` to `src`. The SPA uses HTML5 history and nginx history fallback.
- ESLint, Oxlint, and `vue-tsc --build` are configured; no frontend automated tests exist.

### User-facing features

- Login and active-repository selection from `src/stores/logged-user.ts` and `src/services/backend-auth.ts`.
- Location hierarchy browsing, breadcrumb navigation, location naming, and creation of root/child locations through QR scans: `PostoDetails.vue`, `PostoHeader.vue`, `QrScanner.vue`.
- Object browsing/editing, gallery image capture/upload/delete, thumbnail choice, relocation by scanned location, deletion, and checkout: `OggettoDetails.vue`, `CameraAdvanced.vue`, `AddPhotosButton.vue`, `browse-data.ts`.
- Five-second undo windows for object deletion and checkout: `undoable-actions.ts` and `UndoableActionsStack.vue`.
- Repository-configured item forms with text, chips, stars, and quantity field components; the frontend dynamically renders schema fields from the authenticated user's repository data.
- Schema-driven search with infinite scrolling and a fixed page size of five: `SearchPage.vue` and `search-data.ts`.
- QR scanning supports rear-camera preference, manual entry, UUID generation, single/multiple scans, device switch, and torch when available. `/qr/:uuid` resolves an ID and redirects to the correct item or location.
- Print-label screen (`/print`) makes configurable A4 SVG QR-label grids with deterministic identicons and browser printing.

### Routes

`/`, `/user`, `/search`, `/posto/:uuid`, `/oggetto/:uuid`, `/qr/:uuid`, and `/print` are the useful routes. `/browse` incorrectly mounts a component that requires a UUID, while `/about`, `/camera`, and `/advanced` are placeholder/demo routes. Router-level guards are absent; `App.vue` conditionally shows the login view after its initial `/user` check.

### Current frontend gaps

- Stars search is a placeholder; quantity search renders and initializes the text-search behavior.
- Home and About are placeholders. `CameraSquare.vue`, `CameraUpload.vue`, `NodeDetails.vue`, several models/services, and the template counter store are unused or incomplete.
- The bearer-token helper is ineffective: login assigns `config.token` rather than the Pinia ref's `.value`; cookie authentication is the actual path.
- `dove-vue/README.md` is still the generated Vite template.

## Backend

### Stack and configuration

- Spring MVC servlet application with JPA/Hibernate, PostgreSQL JDBC, Spring Security, JWT (`jjwt`), BCrypt, TOTP support, Jackson/Hypersistence JSON, Actuator, and Caffeine. WebFlux is also declared but not evidently used.
- Configuration: `dove-rest/src/main/resources/application.properties`. Database settings come from `DEPS_DB_*`; Hibernate DDL is disabled, application port is 8080, and management port is 8081.
- Images are stored below `APP_PICTURES_DIR` (`/data` in production); the backend has no object-storage service.
- No Java test source files exist despite test dependencies in `pom.xml`.

### Authentication and authorization

- `POST /authenticate` is public. It authenticates user/password, returns a JWT plus user/repository data, and sets an HttpOnly `auth_token` cookie. Tokens last 8 hours.
- Authentication accepts the cookie first or a Bearer JWT. All regular API routes require a logged-in user; OPTIONS and public Actuator GETs are allowed.
- `POST /logout` only clears the cookie. The token blacklist model/service exists but logout does not add a token to it.
- Every authenticated account has one `user` authority. There is no route-level repository, ownership, or role authorization, so authenticated users can access and alter broadly by identifier.
- The code contains unexposed/incomplete TOTP primitives. MFA is always reported disabled and has no HTTP setup or verification flow.

### API surface

All routes below require authentication unless noted otherwise.

| Route | Operations |
| --- | --- |
| `/authenticate` | `POST` public login. |
| `/user`, `/logout`, `/hash` | Current user, cookie logout, and authenticated BCrypt hashing utility. |
| `/app/alive`, `/app/config` | Health-like boolean and active profile information. |
| `/posto`, `/posto/{uuid}` | List, read, and save locations. |
| `/posto/{branch}`, `/posto/{parent}/{branch}` | Create root or child locations. |
| `/posto/{main}/codes` | Associate/reuse scanned object codes at a location. |
| `/oggetto`, `/oggetto/{uuid}` | List, read, create/save, or delete items. |
| `/oggetto/{uuid}/picture`, `/gallery/{uuid}`, `/picture/{uuid}/{code}` | Add one image, add many images, or delete an image. |
| `/oggetto/{id}/drop/{prefix}`, `/oggetto/{id}/checkout` | Prefix/rekey an item ID, or snapshot it into checkout and remove the active item/images. |
| `/browse/root`, `/browse/posto/{uuid}`, `/browse/oggetto/{uuid}` | Navigation DTOs for roots, locations, and items. `POST /browse/posto/{uuid}/add/{item}` adds/creates an item at a location. |
| `/any/{uuid}`, `/any/{uuid}/browse`, `/broker/{uuid}` | Lightweight QR ID resolution and mixed location/item lookup. |
| `/schema/list` | Repository schemas. |
| `/oggetto/list`, `/oggetto/{tipo}/list`, `/search/oggetto` | Item listings and paginated schema/JSONB search. The type-filter route currently returns all objects. |
| `/ordine/aperti`, `/ordine/{id}`, `/ordine/new/{client}`, `/ordine/{order}/{item}` | Open orders, order retrieval/creation, and item-order linking. No current Vue UI uses these routes. |

### Backend implementation cautions

- Login appears broken: `CustomAuthenticationProvider` advertises normal username/password-token support but only handles its custom MFA token; it is also manually constructed, so its autowired dependencies are not injected.
- The default JWT HMAC secret is committed in application properties. Cookie security/SameSite is not explicit, CSRF is disabled despite cookie authentication, and default CORS `app.url` is empty.
- Password-bearing login DTOs are debug-logged via Lombok `@Data`; `/hash` is a password-hashing oracle for every authenticated user.
- Image operations use unvalidated base64 data and client path variables as filesystem paths, with no size/type validation; path traversal and partial database/file failures need addressing before exposing untrusted users.
- Many controller paths use `Optional.get()` or generic runtime exceptions, so expected not-found/validation errors likely become HTTP 500 responses.
- Search applies a repository's schema but does not constrain results by `Oggetto.repo`; JSONPath fragments are constructed without robust escaping or request limits.

## Database and Migrations

### Active schema

`database/init/init-000.sql` enables `ltree` and creates an implicit `varchar` to `ltree` cast. `init-002.sql` creates the main schema, and `init-003.sql` adds an admin seed, a `Magazzino` root location, and example accessory/clothing schemas. PostgreSQL initialization runs only for a new data volume.

| Table/view | Key purpose |
| --- | --- |
| `posto` | Warehouse location with dotted `ltree` path and optional thumbnail. |
| `oggetto` | Item ID, owning location, repository, display name, JSONB metadata, thumbnail, and timestamps. |
| `repo_schemi` | A root repository/location's JSONB item schemas and checkout form schema. |
| `breadcrumbs` | View deriving ordered ancestors from `posto.percorso`. |
| `utente`, `utente_repo` | User credentials/account flags and assigned repositories. |
| `cliente`, `utente_cliente` | Clients and users permitted to view their open orders. |
| `ordine`, `oggetto_ordine` | Orders and the selected item per order relationship. |
| `checkout` | Snapshots of checked-out items and form data. |
| `token_blacklist` | Persisted JWT invalidation records, currently not used during logout. |

Relationships are primarily ID columns and service/repository queries rather than JPA associations. `oggetto.repo` references `repo_schemi`; location hierarchy is calculated by `ltree`, not a parent-ID column.

### Flyway

- `V202605091519__oggetto-timestamps.sql` ensures `registrato`/`modificato` and their update trigger on `oggetto`.
- `V202605191922__repo-checkout.sql` adds `repo_schemi.checkout` and the `checkout` table.
- The latter migration creates `trigger_checkout_modificato` on `oggetto`, not `checkout`; its name and target indicate a likely migration defect. It also relies on the prior migration's `aggiorna_modificato()` function.

`sql/` contains historical dumps and manual setup scripts. Do not use it as the source of truth for a new deployment; use `database/init/` plus Flyway.

## Domain Model and Features

- A repository is rooted at a `posto` and has schemas in `repo_schemi`; a user's `utente_repo` records determine repositories returned at login.
- A location's `percorso` is its ancestor chain; child paths append a UUID after hyphens are converted to underscores for `ltree` compatibility.
- Each item has a flexible JSONB `scheda` selected by a schema type. Current seed schemas include `accessorio` with stars/text fields and `vestiti` with chips for age, sex, and season.
- Item pictures are files under an item-ID directory; the API returns image IDs, with the frontend constructing their public URL.
- Checkout snapshots an item's JSON and supplied checkout form before deleting the source item and its images. It is not an order fulfillment workflow.
- Orders retain a separate legacy model: client-specific `nuovo` orders and `selezionato` item lines. Backend support exists but is not integrated into the Vue application.

## API Surface

The route table in the Backend section is the source index. Request and response shapes are represented by controller DTOs and entities under `dove-rest/src/main/java/it/dantar/cav/mvc/` and `entities/`; no OpenAPI contract exists.

`postman/collection.json` only covers basic location retrieval, login, and `/app/alive`. It is stale: it defaults to port 8180 rather than the backend endpoint and includes an unused empty authenticate request.

## Configuration

| Variable | Production value/use |
| --- | --- |
| `APP_URL` | `https://dove.dantar.it`; backend CORS allowed origin and frontend runtime value. |
| `BACKEND_URL` | `/backend`; SPA API base path through SWAG. |
| `IMAGES_URL` | `/images`; SPA image base path served by SWAG. |
| `DEPS_DB_URL`, `DEPS_DB_DBNAME`, `DEPS_DB_USERNAME`, `DEPS_DB_PASSWORD` | Spring datasource components. Docker compose supplies the internal database hostname and default local credentials. |
| `APP_PICTURES_DIR` | Filesystem root for backend image storage, `/data` in deployed compose. |
| `LOGGING_FILE_NAME` | Backend log path, `/logs/backend.log` in deployed compose. |

Database credentials and an initial admin password are presently embedded in deployment/init materials. Replace them and move secrets out of tracked configuration before any broader or untrusted deployment.

## Development Workflow

1. Start with the relevant component: `dove-vue/` for UI/API-consumer work, `dove-rest/` for REST/data behavior, `database/init/` and `flyway/sql/` for schema changes, and `deploy/` for the artifact deployment path.
2. For backend changes, package with `mvn clean package`; for frontend changes, use `npm ci` then `npm run build`. `scripts/build-dove.sh` performs both and assumes the local NVM installation at `/home/daniele/.nvm/nvm.sh`.
3. Add only forward-only, timestamp-named Flyway migrations for changes to initialized database structure. Never modify a migration already applied to a shared environment.
4. Run `scripts/deploy-dove.sh` only when intentionally deploying: it stops early if the frontend or backend artifacts are missing, rsyncs deployment files and artifacts to `dantar:/opt/web/dove`, then runs `docker compose up -d --build --remove-orphans` to rebuild images and recreate only changed containers.
5. Treat `obsolete-deploy-prod.sh` as historical Angular-era deployment code. `scripts/init-db.sh` targets a host PostgreSQL user and the legacy `sql/init-db.sql`, not the Docker initialization flow.

## Testing and Quality

- Backend: Maven test dependencies/plugins exist, but `src/test` is absent.
- Frontend: type checks occur as part of `npm run build`; linting is available through `npm run lint`; automated browser/unit test tooling is absent.
- No CI workflow was found.
- Prioritize tests around login/authentication, repository authorization, QR resolution, location path construction, item checkout/file consistency, and Flyway migration against an initialized database.

## Current State and Gaps

- Product TODO in `resources/todo.txt`: decide where to place the confirmation control after scanning codes.
- The checkout UI and backend work are recent. Validate their end-to-end behavior, particularly undo, image cleanup, and checkout migration/schema data.
- Resolve the broken/ambiguous custom authentication provider before relying on login in a clean deployment.
- Complete or remove inactive MFA, camera, schema-search, order, and placeholder UI code to keep the operational surface clear.
- Add authorization boundaries before multiple users or repositories are trusted with shared deployment access.
- Fix production-grade secret management, cookie/CORS/CSRF behavior, image validation, structured errors, and test coverage.

## Session Notes

When adding future session notes, record the date, branch/commit, what changed, verification performed, and any intentionally deferred concern. Keep confirmed project behavior in the sections above rather than duplicating it here.

- 2026-10-29 (main, after 87f8b7a): production moved to the new `dantar` server at `/opt/web/dove`, using a `proxy`-network layout. `scripts/deploy-dove.sh`, `deploy/docker-compose.yml`, `deploy/swag/`, and `deploy/export-ports.sh` were updated to match the live server (verified by diffing the compose file and by an rsync dry run). Production had only `V202605091519` applied; the next deploy applies `V202605191922__repo-checkout.sql` for the first time — dump the database first.
