# ResourceLocation

## Class signature

```java
public class ResourceLocation extends java.lang.Object
```

## Constructors

- `protected ResourceLocation(int p_i45928_1_, java.lang.String... resourceName)`
- `public ResourceLocation(java.lang.String resourceName)`
- `public ResourceLocation(java.lang.String resourceDomainIn, java.lang.String resourcePathIn)`

## Methods

- `protected static java.lang.String[] splitObjectName(java.lang.String toSplit)`
- `public java.lang.String getResourcePath()`
- `public java.lang.String getResourceDomain()`
- `public java.lang.String toString()`
- `public boolean equals(java.lang.Object p_equals_1_)`
- `public int hashCode()`

## Description

Splits an object name (such as minecraft:apple) into the domain and path parts and returns these as an array of length 2.