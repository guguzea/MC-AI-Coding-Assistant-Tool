# DistancePredicate

## Class signature

```java
public class DistancePredicate extends java.lang.Object
```

## Constructors

- `public DistancePredicate( MinMaxBounds x, MinMaxBounds y, MinMaxBounds z, MinMaxBounds horizontal, MinMaxBounds absolute)`

## Methods

- `public boolean test(double x1, double y1, double z1, double x2, double y2, double z2)`
- `public static DistancePredicate deserialize(JsonElement element)`