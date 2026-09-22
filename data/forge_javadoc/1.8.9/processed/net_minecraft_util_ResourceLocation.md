# ResourceLocation

**Inheritance:** java.lang.Object → net.minecraft.util.ResourceLocation

## Class signature

```java
public class ResourceLocation extends java.lang.Object
```

## Constructors

- `ResourceLocation(int p_i45928_1_, java.lang.String... resourceName)`
- `ResourceLocation(java.lang.String resourceName)`
- `ResourceLocation(java.lang.String resourceDomainIn, java.lang.String resourcePathIn)`

## Methods

- `boolean equals(java.lang.Object p_equals_1_)`
- `java.lang.String getResourceDomain()`
- `java.lang.String getResourcePath()`
- `int hashCode()`
- `protected static java.lang.String[] splitObjectName(java.lang.String toSplit)` — Splits an object name (such as minecraft:apple) into the domain and path parts and returns these as an array of length 2.
- `java.lang.String toString()`

## Fields

- `protected java.lang.String resourceDomain`
- `protected java.lang.String resourcePath`