---
title: "ICapabilityProvider"
description: "public interface ICapabilityProvider"
package: "net/minecraftforge/common/capabilities"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/common/capabilities/ICapabilityProvider.html"
sourceType: javadoc
---

# ICapabilityProvider

## Class signature

```java
public interface ICapabilityProvider
```

## Methods

- `<T> T getCapability(Capability<T> capability, EnumFacing facing)` — Retrieves the handler for the capability requested on the specific side.
- `boolean hasCapability(Capability<?> capability, EnumFacing facing)` — Determines if this object has support for the capability in question on the specific side.
