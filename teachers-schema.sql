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
    classTime TEXT
    
);


CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    classID INTEGER
    REFERENCES classes ON DELETE CASCADE,
    name TEXT
    
    
);


CREATE TABLE behaviors (
    id SERIAL PRIMARY KEY,
    studentID INTEGER
    REFERENCES students ON DELETE CASCADE,
    assigned TEXT,
    chartDate TEXT,
    name TEXT NOT NULL,
    note TEXT,
    score INTEGER
);