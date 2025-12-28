# Perl Shared State Tests
<!-- share-code-between-examples -->

## Declaration
```perl
$x = 10;
```

## Usage
```perl
if ($x != 10) {
    die "State not shared";
}
print "State shared successfully\n";
```

