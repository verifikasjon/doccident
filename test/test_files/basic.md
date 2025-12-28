# BASIC Tests

## Simple Snippet
```basic
10 PRINT "HELLO BASIC"
20 END
```

## Advanced Logic (Loops and Subs)
```basic
10 FOR I = 1 TO 5
20 GOSUB 100
30 NEXT I
40 END
100 PRINT "ITERATION "; I
110 RETURN
```

## Data Statements
```basic
10 READ N
20 FOR I = 1 TO N
30 READ A$
40 PRINT "READ: "; A$
50 NEXT I
60 DATA 3, "APPLE", "BANANA", "CHERRY"
70 END
```
