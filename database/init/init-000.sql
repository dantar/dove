-- cfr https://stackoverflow.com/questions/60782438/ltree-postgres-type-using-spring-data-jpa-geting-syntax-error-after-defining

CREATE EXTENSION ltree;

CREATE OR REPLACE FUNCTION ltree_invarchar(varchar) RETURNS ltree AS $$
SELECT ltree_in($1::cstring);
$$ LANGUAGE SQL IMMUTABLE;

CREATE CAST (varchar AS ltree) WITH FUNCTION ltree_invarchar(varchar) AS IMPLICIT;
