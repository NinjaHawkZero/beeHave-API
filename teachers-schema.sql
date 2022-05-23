CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25),
    password TEXT NOT NULL,
    img_url TEXT

);


CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    teacherID INTEGER
    REFERENCES teachers ON DELETE CASCADE,
    name TEXT NOT NULL,
    img_url TEXT

);


CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    classID INTEGER
    REFERENCES classes ON DELETE CASCADE,
    name TEXT,
    age INTEGER,
    behaveScore INTEGER,
    img_url TEXT
);


CREATE TABLE behaviors (
    id SERIAL PRIMARY KEY,
    studentID INTEGER
    REFERENCES students ON DELETE CASCADE,
    assigned DATE,
    name TEXT NOT NULL,
    note TEXT,
    score INTEGER
);