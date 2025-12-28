# COBOL Tests

## Hello World
```cobol
       IDENTIFICATION DIVISION.
       PROGRAM-ID. HELLO.
       PROCEDURE DIVISION.
           DISPLAY 'Hello World'.
           STOP RUN.
```

## Free Format
```cobol
IDENTIFICATION DIVISION.
PROGRAM-ID. FREE.
PROCEDURE DIVISION.
DISPLAY "Hello Free Format".
STOP RUN.
```

## Variables and Logic
```cobol
       IDENTIFICATION DIVISION.
       PROGRAM-ID. LOGIC.
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01 NUM1 PIC 99 VALUE 10.
       01 NUM2 PIC 99 VALUE 20.
       01 RES  PIC 99.
       PROCEDURE DIVISION.
           COMPUTE RES = NUM1 + NUM2.
           IF RES NOT = 30 THEN
               DISPLAY 'Error: 10 + 20 should be 30'
               STOP RUN RETURNING 1
           END-IF.
           DISPLAY 'Success'.
           STOP RUN.
```

## Failure
```cobol
       IDENTIFICATION DIVISION.
       PROGRAM-ID. FAIL.
       PROCEDURE DIVISION.
           STOP RUN RETURNING 1.
```

## Compilation Error
```cobol
       IDENTIFICATION DIVISION.
       PROGRAM-ID. ERROR.
       PROCEDURE DIVISION.
           DSIPLAY 'Typo'.
```

