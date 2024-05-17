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

-- 86a3555f-adb0-4750-a5b2-5647b6ce90be