---
title: "IForgeRegistryEntry"
description: "public interface IForgeRegistryEntry<V>"
package: "net/minecraftforge/registries"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/registries/IForgeRegistryEntry.html"
sourceType: javadoc
---

# IForgeRegistryEntry

## Class signature

```java
public interface IForgeRegistryEntry<V>
```

## Methods

- `ResourceLocation getRegistryName()` — A unique identifier for this entry, if this entry is registered already it will return it's official registry name.
- `java.lang.Class<V> getRegistryType()`
- `V setRegistryName(ResourceLocation name)` — Sets a unique name for this Item.
