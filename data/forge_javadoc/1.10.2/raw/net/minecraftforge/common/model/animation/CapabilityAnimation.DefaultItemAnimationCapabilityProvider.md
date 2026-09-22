---
title: "CapabilityAnimation.DefaultItemAnimationCapabilityProvider"
description: "public static class CapabilityAnimation.DefaultItemAnimationCapabilityProvider extends java.lang.Object implements ICapabilityProvider"
package: "net/minecraftforge/common/model/animation"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/common/model/animation/CapabilityAnimation.DefaultItemAnimationCapabilityProvider.html"
sourceType: javadoc
---

# CapabilityAnimation.DefaultItemAnimationCapabilityProvider

**Inheritance:** java.lang.Object → net.minecraftforge.common.model.animation.CapabilityAnimation.DefaultItemAnimationCapabilityProvider

## Class signature

```java
public static class CapabilityAnimation.DefaultItemAnimationCapabilityProvider extends java.lang.Object implements ICapabilityProvider
```

## Constructors

- `DefaultItemAnimationCapabilityProvider(IAnimationStateMachine asm)`

## Methods

- `<T> T getCapability(Capability<T> capability, EnumFacing facing)` — Retrieves the handler for the capability requested on the specific side.
- `boolean hasCapability(Capability<?> capability, EnumFacing facing)` — Determines if this object has support for the capability in question on the specific side.
