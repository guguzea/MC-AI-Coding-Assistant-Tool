---
title: "CapabilityDispatcher"
description: "A high-speed implementation of a capability delegator. This is used to wrap the results of the AttachCapabilitiesEvent. It is HIGHLY recommended that you DO NOT use this approach unless you MUST deleg"
package: "net/minecraftforge/common/capabilities"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/common/capabilities/CapabilityDispatcher.html"
sourceType: javadoc
---

# CapabilityDispatcher

## Class signature

```java
public final class CapabilityDispatcher extends java.lang.Object implements INBTSerializable < NBTTagCompound >, ICapabilityProvider
```

## Constructors

- `public CapabilityDispatcher(java.util.Map< ResourceLocation , ICapabilityProvider > list)`
- `public CapabilityDispatcher(java.util.Map< ResourceLocation , ICapabilityProvider > list, ICapabilityProvider parent)`

## Methods

- `public boolean hasCapability( Capability <?> capability, @Nullable EnumFacing facing)`
- `public <T> T getCapability( Capability <T> capability, @Nullable EnumFacing facing)`
- `public NBTTagCompound serializeNBT()`
- `public void deserializeNBT( NBTTagCompound nbt)`
- `public boolean areCompatible( CapabilityDispatcher other)`

## Description

A high-speed implementation of a capability delegator. This is used to wrap the results of the AttachCapabilitiesEvent. It is HIGHLY recommended that you DO NOT use this approach unless you MUST deleg
