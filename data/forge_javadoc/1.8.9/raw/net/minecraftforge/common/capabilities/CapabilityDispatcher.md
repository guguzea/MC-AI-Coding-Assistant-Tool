---
title: "CapabilityDispatcher"
description: "public final class CapabilityDispatcher extends java.lang.Object implements INBTSerializable<NBTTagCompound>, ICapabilityProvider"
package: "net/minecraftforge/common/capabilities"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/common/capabilities/CapabilityDispatcher.html"
sourceType: javadoc
---

# CapabilityDispatcher

**Inheritance:** java.lang.Object → net.minecraftforge.common.capabilities.CapabilityDispatcher

## Class signature

```java
public final class CapabilityDispatcher extends java.lang.Object implements INBTSerializable<NBTTagCompound>, ICapabilityProvider
```

## Constructors

- `CapabilityDispatcher(java.util.Map<ResourceLocation, ICapabilityProvider> list)`
- `CapabilityDispatcher(java.util.Map<ResourceLocation, ICapabilityProvider> list, ICapabilityProvider parent)`

## Methods

- `void deserializeNBT(NBTTagCompound nbt)`
- `<T> T getCapability(Capability<T> capability, EnumFacing facing)` — Retrieves the handler for the capability requested on the specific side.
- `boolean hasCapability(Capability<?> capability, EnumFacing facing)` — Determines if this object has support for the capability in question on the specific side.
- `NBTTagCompound serializeNBT()`
