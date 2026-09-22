---
title: "IForgeRegistryEntry"
description: "public interface IForgeRegistryEntry<V>"
package: "net/minecraftforge/fml/common/registry"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/registry/IForgeRegistryEntry.html"
sourceType: javadoc
---

# IForgeRegistryEntry

## Class signature

```java
public interface IForgeRegistryEntry<V>
```

## Methods

- `ResourceLocation getRegistryName()` — A unique identifier for this entry, if this entry is registered already it will return it's official registry name.
- `java.lang.Class<? super V> getRegistryType()`
- `V setRegistryName(ResourceLocation name)` — Sets a unique name for this Item.
