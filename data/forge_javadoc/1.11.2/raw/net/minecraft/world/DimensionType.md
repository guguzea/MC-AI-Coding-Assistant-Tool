---
title: "DimensionType"
description: "public enum DimensionType extends java.lang.Enum<DimensionType>"
package: "net/minecraft/world"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/DimensionType.html"
sourceType: javadoc
---

# DimensionType

**Inheritance:** java.lang.Object → java.lang.Enum<DimensionType> → net.minecraft.world.DimensionType

## Class signature

```java
public enum DimensionType extends java.lang.Enum<DimensionType>
```

## Methods

- `WorldProvider createDimension()`
- `static DimensionType getById(int id)`
- `int getId()`
- `java.lang.String getName()`
- `java.lang.String getSuffix()`
- `static DimensionType register(java.lang.String name, java.lang.String suffix, int id, java.lang.Class<? extends WorldProvider> provider, boolean keepLoaded)`
- `DimensionType setLoadSpawn(boolean value)`
- `boolean shouldLoadSpawn()`
- `static DimensionType valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static DimensionType [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.
