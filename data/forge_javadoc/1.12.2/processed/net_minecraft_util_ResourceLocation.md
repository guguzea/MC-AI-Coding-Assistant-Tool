# ResourceLocation

**Inheritance:** java.lang.Object → net.minecraft.util.ResourceLocation

## Class signature

```java
public class ResourceLocation extends java.lang.Object implements java.lang.Comparable<ResourceLocation>
```

## Constructors

- `ResourceLocation(int unused, java.lang.String... resourceName)`
- `ResourceLocation(java.lang.String resourceName)`
- `ResourceLocation(java.lang.String resourceDomainIn, java.lang.String resourcePathIn)`

## Methods

- `int compareTo(ResourceLocation p_compareTo_1_)`
- `boolean equals(java.lang.Object p_equals_1_)`
- `java.lang.String getResourceDomain()`
- `java.lang.String getResourcePath()`
- `int hashCode()`
- `static java.lang.String[] splitObjectName(java.lang.String toSplit)`
- `java.lang.String toString()`

## Fields

- `protected java.lang.String resourceDomain`
- `protected java.lang.String resourcePath`