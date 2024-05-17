-- createdb dove
create user dove with encrypted password 'dove';
grant all privileges on database dove to dove;
grant all privileges on table oggetto to dove;
grant all privileges on table posto to dove;
grant all privileges on table utente to dove;

-- Drop table
-- DROP TABLE public.oggetto;

CREATE TABLE public.oggetto (
	id varchar NOT NULL,
	id_posto varchar NULL,
	scheda jsonb NULL,
	nome varchar NULL,
	CONSTRAINT oggetto_pk PRIMARY KEY (id)
);

-- Drop table
-- DROP TABLE public.posto;
CREATE TABLE public.posto (
	id varchar NOT NULL,
	nome varchar NULL,
	percorso ltree NULL,
	CONSTRAINT posto_pk PRIMARY KEY (id)
);

-- Drop table
-- DROP TABLE public.utente;
CREATE TABLE public.utente (
	id varchar NOT NULL,
	username varchar NOT NULL,
	"password" varchar NULL,
	hash varchar NULL,
	salt varchar NULL,
	abilitato bool NULL,
	account_valido bool NULL,
	credenziali_valide bool NULL,
	account_attivo bool NULL,
	CONSTRAINT utente_pk PRIMARY KEY (id)
);

-- public.breadcrumbs source

CREATE OR REPLACE VIEW public.breadcrumbs
AS SELECT (p.id::text || '|'::text) || c.id::text AS id,
    c.id AS id_posto,
    p.id AS id_breadcrumb,
    COALESCE(nlevel(p.percorso), 0) AS sort
   FROM posto p
     JOIN posto c ON (COALESCE(p.percorso, ''::ltree) || replace(p.id::text, '-'::text, '_'::text)) @> (c.percorso || replace(c.id::text, '-'::text, '_'::text))
  WHERE c.id::text <> p.id::text;