# Fortran Shared State Tests
<!-- share-code-between-examples -->

## Module Definition
```fortran
module math_ops
    implicit none
    contains
    function add(a, b) result(res)
        integer, intent(in) :: a, b
        integer :: res
        res = a + b
    end function add
end module math_ops
```

## Usage
```fortran
use math_ops
integer :: result
result = add(10, 20)
if (result /= 30) then
    stop 1
end if
print *, "Success:", result
```

