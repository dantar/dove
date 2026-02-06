insert into utente (id, username, password, hash, abilitato, account_valido, account_attivo, credenziali_valide)
values (uuidv4(), 'admin', 'daniele', 'plain', true, true, true, true);

insert into posto (id, nome)
values (uuidv4(), 'Magazzino');