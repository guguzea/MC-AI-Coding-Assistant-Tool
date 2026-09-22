---
title: "IForgeRegistryEntry.Impl"
description: "public static class IForgeRegistryEntry.Impl<T extends IForgeRegistryEntry<T>> extends java.lang.Object implements IForgeRegistryEntry<T>"
package: "net/minecraftforge/fml/common/registry"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/registry/IForgeRegistryEntry.Impl.html"
sourceType: javadoc
---

# IForgeRegistryEntry.Impl

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<T>

## Class signature

```java
public static class IForgeRegistryEntry.Impl<T extends IForgeRegistryEntry<T>> extends java.lang.Object implements IForgeRegistryEntry<T>
```

## Constructors

- `Impl()`

## Methods

- `ResourceLocation getRegistryName()` — A unique identifier for this entry, if this entry is registered already it will return it's official registry name.
- `java.lang.Class<? super T> getRegistryType()`
- `T setRegistryName(ResourceLocation name)` — Sets a unique name for this Item.
- `T setRegistryName(java.lang.String name)`
- `T setRegistryName(java.lang.String modID, java.lang.String name)`

## Fields

- `RegistryDelegate<T> delegate`
