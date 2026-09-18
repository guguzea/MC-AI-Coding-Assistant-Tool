---
title: "CapabilityManager"
description: "Registers a capability to be consumed by others."
package: "net/minecraftforge/common/capabilities"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/common/capabilities/CapabilityManager.html"
sourceType: javadoc
---

# CapabilityManager

## Class signature

```java
public enum CapabilityManager extends java.lang.Enum< CapabilityManager >
```

## Methods

- `public static CapabilityManager [] values()`
- `public static CapabilityManager valueOf(java.lang.String name)`
- `public <T> void register(java.lang.Class<T> type, Capability.IStorage <T> storage, java.lang.Class<? extends T> implementation)`
- `public <T> void register(java.lang.Class<T> type, Capability.IStorage <T> storage, java.util.concurrent.Callable<? extends T> factory)`
- `public void injectCapabilities( ASMDataTable data)`

## Description

Registers a capability to be consumed by others.
