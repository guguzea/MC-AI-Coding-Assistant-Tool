---
title: "IForgeRegistryEntry"
description: "A unique identifier for this entry, if this entry is registered already it will return it's official registry name."
package: "net/minecraftforge/event"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/registry/IForgeRegistryEntry.html"
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
