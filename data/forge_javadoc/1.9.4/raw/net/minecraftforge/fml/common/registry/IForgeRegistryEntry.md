---
title: "IForgeRegistryEntry"
description: "A unique identifier for this entry, if this entry is registered already it will return it's official registry name."
package: "net/minecraftforge/fml/common/registry"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/registry/IForgeRegistryEntry.html"
sourceType: javadoc
---

# IForgeRegistryEntry

## Class signature

```java
public interface IForgeRegistryEntry<V>
```

## Methods

- `V setRegistryName( ResourceLocation name)`
- `ResourceLocation getRegistryName()`
- `java.lang.Class<? super V > getRegistryType()`

## Description

A unique identifier for this entry, if this entry is registered already it will return it's official registry name.
