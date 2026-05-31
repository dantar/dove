ALTER TABLE public.repo_schemi 
ADD COLUMN IF NOT exists checkout jsonb 
NOT NULl default '[]';

CREATE TABLE if not exists public.checkout (
	id varchar NOT NULL,
	repo varchar NOT NULL,
	scheda jsonb NULL,
	oggetto jsonb NULL,
	registrato timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	modificato timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT checkout_pk PRIMARY KEY (id),
	CONSTRAINT fk_checkout_repo FOREIGN KEY (repo) REFERENCES public.repo_schemi(id)
);

DROP TRIGGER IF exists trigger_checkout_modificato on public.oggetto;
create trigger trigger_checkout_modificato 
before update on public.oggetto 
for each row execute function aggiorna_modificato();
