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


  CREATE TABLE public.cliente (
	id varchar NOT NULL,
	nome varchar NOT NULL,
	scheda jsonb NOT NULL,
	CONSTRAINT cliente_pk PRIMARY KEY (id)
);

CREATE TABLE public.utente_cliente (
	id integer NOT NULL,
	id_utente varchar NOT NULL,
	id_cliente varchar NOT NULL,
	CONSTRAINT utente_cliente_pk PRIMARY KEY (id),
    CONSTRAINT utente_cliente_fk_utente FOREIGN KEY (id_utente) REFERENCES public.utente(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT utente_cliente_fk_cliente FOREIGN KEY (id_cliente) REFERENCES public.cliente(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE public.ordine (
	id varchar NOT NULL,
	id_cliente varchar NOT NULL,
	scheda jsonb NOT NULL,
	stato varchar NOT NULL,
	CONSTRAINT ordine_pk PRIMARY KEY (id),
	CONSTRAINT ordine_fk_cliente FOREIGN KEY (id_cliente) REFERENCES public.cliente(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE public.oggetto_ordine (
	id integer NOT NULL,
	id_oggetto varchar NOT NULL,
	id_ordine varchar NOT NULL,
	stato varchar NOT NULL,
	CONSTRAINT oggetto_ordine_pk PRIMARY KEY (id),
    CONSTRAINT oggetto_ordine_un UNIQUE (id_oggetto),
	CONSTRAINT oggetto_ordine_fk_oggetto FOREIGN KEY (id_oggetto) REFERENCES public.oggetto(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT oggetto_ordine_fk_ordine FOREIGN KEY (id_ordine) REFERENCES public.ordine(id) ON DELETE CASCADE ON UPDATE CASCADE
);
