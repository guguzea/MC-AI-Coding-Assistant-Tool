---
title: "CapabilityAnimation.DefaultItemAnimationCapabilityProvider"
description: "public static class CapabilityAnimation.DefaultItemAnimationCapabilityProvider extends java.lang.Object implements ICapabilityProvider"
package: "net/minecraftforge/common/model/animation"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/model/animation/CapabilityAnimation.DefaultItemAnimationCapabilityProvider.html"
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
