---
title: "RegistryBuilder"
description: "public class RegistryBuilder<T extends IForgeRegistryEntry<T>> extends java.lang.Object"
package: "net/minecraftforge/fml/common/registry"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/common/registry/RegistryBuilder.html"
sourceType: javadoc
---

# RegistryBuilder

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.RegistryBuilder<T>

## Class signature

```java
public class RegistryBuilder<T extends IForgeRegistryEntry<T>> extends java.lang.Object
```

## Constructors

- `RegistryBuilder()`

## Methods

- `RegistryBuilder<T> add(IForgeRegistry.AddCallback<T> add)`
- `RegistryBuilder<T> add(IForgeRegistry.ClearCallback<T> clear)`
- `RegistryBuilder<T> add(IForgeRegistry.CreateCallback<T> create)`
- `RegistryBuilder<T> add(IForgeRegistry.SubstitutionCallback<T> sub)`
- `RegistryBuilder<T> addCallback(java.lang.Object inst)`
- `IForgeRegistry<T> create()`
- `RegistryBuilder<T> setIDRange(int min, int max)`
- `RegistryBuilder<T> setName(ResourceLocation name)`
- `RegistryBuilder<T> setType(java.lang.Class<T> type)`
