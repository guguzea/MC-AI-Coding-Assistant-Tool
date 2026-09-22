# LocationPredicate

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.LocationPredicate

## Class signature

```java
public class LocationPredicate extends java.lang.Object
```

## Constructors

- `LocationPredicate(MinMaxBounds x, MinMaxBounds y, MinMaxBounds z, Biome biome, java.lang.String feature, DimensionType dimension)`

## Methods

- `static LocationPredicate deserialize(JsonElement element)`
- `boolean test(WorldServer world, double x, double y, double z)`
- `boolean test(WorldServer world, float x, float y, float z)`

## Fields

- `static LocationPredicate ANY`