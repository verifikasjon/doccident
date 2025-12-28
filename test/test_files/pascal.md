# Pascal Tests

## Simple Snippet (Auto-wrapped)
```pascal
writeln('Hello Pascal');
```

## Full Program
```pascal
program Hello;
begin
    writeln('Hello from Pascal program');
    if (1 + 1 <> 2) then
        halt(1);
end.
```

## Advanced Features (Records and Arrays)
```pascal
program Advanced;
type
    TPoint = record
        X, Y: Integer;
    end;
var
    P: TPoint;
    Numbers: array[1..5] of Integer;
    I: Integer;
begin
    P.X := 10;
    P.Y := 20;
    
    if (P.X + P.Y <> 30) then halt(1);
    
    for I := 1 to 5 do
        Numbers[I] := I * I;
        
    if Numbers[5] <> 25 then halt(1);
    
    writeln('Records and Arrays working');
end.
```

## Functions and Procedures
```pascal
program Funcs;
    function Add(A, B: Integer): Integer;
    begin
        Add := A + B;
    end;

    procedure PrintResult(Res: Integer);
    begin
        writeln('Result: ', Res);
    end;

begin
    if Add(5, 7) <> 12 then halt(1);
    PrintResult(Add(5, 7));
end.
```

## Failure
```pascal
program Fail;
begin
    halt(1);
end.
```

## Compilation Error
```pascal
program Broken;
begin
    this is not pascal code
end.
```
