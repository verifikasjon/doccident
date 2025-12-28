# Fortran Tests

## Simple Snippet (Auto-wrapped)
```fortran
print *, "Hello Fortran"
```

## Full Program
```fortran
program full
    implicit none
    integer :: i
    i = 10
    if (i /= 10) then
        stop 1
    end if
    print *, "Success"
end program full
```

## Advanced (Modules)
```fortran
module my_math
    implicit none
contains
    function add(a, b) result(res)
        integer, intent(in) :: a, b
        integer :: res
        res = a + b
    end function add
end module my_math

program test_module
    use my_math
    implicit none
    if (add(2, 3) /= 5) then
        stop 1
    end if
end program test_module
```

## Failure
```fortran
program failure
    stop 1
end program failure
```

## Compilation Error
```fortran
program error
    x = "string" ! x is implicit real, assigning string is error
end program error
```

