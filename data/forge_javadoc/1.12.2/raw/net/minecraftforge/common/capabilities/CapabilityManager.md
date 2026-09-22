---
title: "CapabilityManager"
description: "public enum CapabilityManager extends java.lang.Enum<CapabilityManager>"
package: "net/minecraftforge/common/capabilities"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/capabilities/CapabilityManager.html"
sourceType: javadoc
---

# CapabilityManager

**Inheritance:** java.lang.Object → java.lang.Enum<CapabilityManager> → net.minecraftforge.common.capabilities.CapabilityManager

## Class signature

```java
public enum CapabilityManager extends java.lang.Enum<CapabilityManager>
```

## Methods

- `void injectCapabilities(ASMDataTable data)`
- `<T> void register(java.lang.Class<T> type, Capability.IStorage<T> storage, java.util.concurrent.Callable<? extends T> factory)` — Registers a capability to be consumed by others.
- `@Deprecated <T> void register(java.lang.Class<T> type, Capability.IStorage<T> storage, java.lang.Class<? extends T> implementation)` — Deprecated. Use the overload that takes a factory instead of a class. You can easily do this by passing a constructor reference (MyImpl::new instead of MyImpl.class). TODO remove in 1.13.
- `static CapabilityManager valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static CapabilityManager [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.
