---
title: "CapabilityDispatcher"
description: "A high-speed implementation of a capability delegator. This is used to wrap the results of the AttachCapabilitiesEvent. It is HIGHLY recommended that you DO NOT use this approach unless you MUST deleg"
package: "net/minecraftforge/common/capabilities"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/common/capabilities/CapabilityDispatcher.html"
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

- `public boolean hasCapability( Capability <?> capability, EnumFacing facing)`
- `public <T> T getCapability( Capability <T> capability, EnumFacing facing)`
- `public NBTTagCompound serializeNBT()`
- `public void deserializeNBT( NBTTagCompound nbt)`

## Description

A high-speed implementation of a capability delegator. This is used to wrap the results of the AttachCapabilitiesEvent. It is HIGHLY recommended that you DO NOT use this approach unless you MUST deleg
