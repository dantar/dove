insert into utente (id, username, password, hash, abilitato, account_valido, account_attivo, credenziali_valide)
values (gen_random_uuid(), 'admin', 'daniele', 'plain', true, true, true, true);

insert into posto (id, nome)
values (gen_random_uuid(), 'Magazzino');