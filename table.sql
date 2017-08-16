DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures (
    id SERIAL PRIMARY KEY,
    first VARCHAR(200) NOT NULL,
    last VARCHAR(200) NOT NULL,
    signature TEXT NOT NULL
);

INSERT INTO signatures (first, last, signature) VALUES ('Thomas', 'Gsellmann', 'ladida');
