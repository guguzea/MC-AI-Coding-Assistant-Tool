# LocationPredicate

## Class signature

```java
public class LocationPredicate extends java.lang.Object
```

## Constructors

- `public LocationPredicate( MinMaxBounds x, MinMaxBounds y, MinMaxBounds z, Biome biome, java.lang.String feature, DimensionType dimension)`

## Methods

- `public boolean test( WorldServer world, double x, double y, double z)`
- `public boolean test( WorldServer world, float x, float y, float z)`
- `public static LocationPredicate deserialize(JsonElement element)`