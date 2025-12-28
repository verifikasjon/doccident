# R Shared State Tests
<!-- share-code-between-examples -->

## Declaration
```r
x <- 10
```

## Usage
```r
if (x != 10) {
    stop("State not shared")
}
print("State shared successfully")
```

