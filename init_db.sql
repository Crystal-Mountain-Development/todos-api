--extension uuid
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--table creation
CREATE TABLE users (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    username varchar(20),
    email varchar(20)
);

CREATE TABLE authtokens (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    user_id uuid,
    autokens varchar(20) NOT NULL,
    exp_date date,
    CONSTRAINT fk_authtokens_users FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE lists (
    id serial PRIMARY KEY,
    user_id uuid,
    title varchar,
    iscomplete boolean,
    CONSTRAINT fk_users_lists FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE todos (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    list_id int,
    summary varchar NOT NULL,
    iscomplete boolean,
    CONSTRAINT fk_lists_todos FOREIGN KEY (list_id) REFERENCES lists (id)
);