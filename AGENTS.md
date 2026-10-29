# DOVE Agent Guide

Read `DOVE.md` before exploring or changing this repository. It is the maintained project description and records the verified architecture, domain model, API surface, and known limitations.

## Components

- `dove-vue/` is the Vue 3/TypeScript SPA; its API and image base URLs are runtime values fetched from `/config.json` before the app mounts.
- `dove-rest/` is the Java 21 Spring Boot API. It relies on PostgreSQL and writes item images to `APP_PICTURES_DIR`; image storage is a mounted filesystem, not database data.
- `database/init/` is only run when PostgreSQL initializes an empty volume. Make schema changes through new, forward-only migrations in `flyway/sql/`, not `sql/`, which is historical/manual SQL.
- `deploy/` is the active production artifact deployment context. It expects `dove-vue/dist/` and `dove-rest/target/dove-rest.jar` to exist before images are built.

## Commands

- Frontend requires Node `^20.19.0 || >=22.12.0`. From `dove-vue/`: `npm ci`, `npm run type-check`, `npm run lint`, and `npm run build`. `npm run lint` auto-fixes files.
- From `dove-rest/`: `mvn clean package`. There are currently no frontend or backend test source files, so do not claim test coverage based on successful builds.
- `scripts/build-dove.sh` runs the backend package and frontend production build, sourcing `/home/daniele/.nvm/nvm.sh` and selecting Node 22.
- Run `scripts/deploy-dove.sh` only for an intentional deployment: it stops early if `dove-vue/dist/` or `dove-rest/target/dove-rest.jar` is missing, syncs artifacts to the configured `dantar` host, then runs `docker compose ... up -d --build --remove-orphans`, which rebuilds images and recreates only changed containers.

## Git Workflow

- Do not create, switch, merge, or delete branches, and never run `git push`. The user manages all branching and remote push operations.

## Runtime And Deployment

- Production traffic is proxied externally: the SPA uses `/backend` and `/images`, while the backend and nginx containers expose ports 8181 and 8180 respectively. Keep these paths aligned with `deploy/docker-compose.yml` and `deploy/swag/dove.dantar.it.subdomain.conf`.
- The older local compose file is `docker/docker-compose.yml`. Its Flyway bind mount points to `docker/flyway/sql`, but repository migrations are at root `flyway/sql`; correct this before relying on local Compose migrations.
- A new Flyway migration must run against the existing initialized schema. Do not put migration-only changes in `database/init/`, because existing production volumes skip that directory.

## Codebase Conventions

- Item and location identifiers are QR-facing. `posto.percorso` is PostgreSQL `ltree`; Java converts UUID hyphens to underscores when composing hierarchy paths. Preserve that conversion when changing hierarchy behavior.
- Item metadata and repository schemas are JSONB. Schema fields drive the Vue dynamic form and search UI, so coordinate backend schema changes with `dove-vue/src/components/schemas/` and `src/stores/schede-by-schema.ts`.
- Authentication normally uses the HttpOnly `auth_token` cookie. Axios sends credentials globally; do not assume the unused bearer-token helper is active.
