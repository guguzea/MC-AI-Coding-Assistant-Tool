---
title: "Capability.IStorage"
description: "public static interface Capability.IStorage<T>"
package: "net/minecraftforge/common/capabilities"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/common/capabilities/Capability.IStorage.html"
sourceType: javadoc
---

# Capability.IStorage

## Class signature

```java
public static interface Capability.IStorage<T>
```

## Methods

- `void readNBT(Capability<T> capability, T instance, EnumFacing side, NBTBase nbt)` — Read the capability instance from a NBT tag.
- `NBTBase writeNBT(Capability<T> capability, T instance, EnumFacing side)` — Serialize the capability instance to a NBTTag.
