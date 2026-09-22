---
title: "RegistryBuilder"
description: "public class RegistryBuilder<T extends IForgeRegistryEntry<T>> extends java.lang.Object"
package: "net/minecraftforge/registries"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/registries/RegistryBuilder.html"
sourceType: javadoc
---

# RegistryBuilder

**Inheritance:** java.lang.Object → net.minecraftforge.registries.RegistryBuilder<T>

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
- `RegistryBuilder<T> add(IForgeRegistry.ValidateCallback<T> validate)`
- `RegistryBuilder<T> addCallback(java.lang.Object inst)`
- `RegistryBuilder<T> allowModification()`
- `IForgeRegistry<T> create()`
- `RegistryBuilder<T> disableOverrides()`
- `RegistryBuilder<T> disableSaving()`
- `RegistryBuilder<T> set(IForgeRegistry.DummyFactory<T> factory)`
- `RegistryBuilder<T> set(IForgeRegistry.MissingFactory<T> missing)`
- `RegistryBuilder<T> setDefaultKey(ResourceLocation key)`
- `RegistryBuilder<T> setIDRange(int min, int max)`
- `RegistryBuilder<T> setMaxID(int max)`
- `RegistryBuilder<T> setName(ResourceLocation name)`
- `RegistryBuilder<T> setType(java.lang.Class<T> type)`
