---
title: "CapabilityDispatcher"
description: "A high-speed implementation of a capability delegator. This is used to wrap the results of the AttachCapabilitiesEvent. It is HIGHLY recommended that you DO NOT use this approach unless you MUST deleg"
package: "net/minecraftforge/common/capabilities"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/common/capabilities/CapabilityDispatcher.html"
sourceType: javadoc
---

# CapabilityDispatcher

## Class signature

```java
public final class CapabilityDispatcher extends java.lang.Object implements INBTSerializable < NBTTagCompound >, ICapabilityProvider
```

## Constructors

- `public CapabilityDispatcher(java.util.Map< ResourceLocation , ICapabilityProvider > list)`
- `public CapabilityDispatcher(java.util.Map< ResourceLocation , ICapabilityProvider > list, @Nullable ICapabilityProvider parent)`

## Methods

- `public boolean hasCapability(@Nonnull Capability <?> capability, @Nullable EnumFacing facing)`
- `@Nullable public <T> T getCapability(@Nonnull Capability <T> capability, @Nullable EnumFacing facing)`
- `public NBTTagCompound serializeNBT()`
- `public void deserializeNBT( NBTTagCompound nbt)`
- `public boolean areCompatible( CapabilityDispatcher other)`

## Description

A high-speed implementation of a capability delegator. This is used to wrap the results of the AttachCapabilitiesEvent. It is HIGHLY recommended that you DO NOT use this approach unless you MUST deleg
