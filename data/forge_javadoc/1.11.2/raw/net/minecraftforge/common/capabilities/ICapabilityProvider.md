---
title: "ICapabilityProvider"
description: "Retrieves the handler for the capability requested on the specific side."
package: "net/minecraftforge/common/capabilities"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/common/capabilities/ICapabilityProvider.html"
sourceType: javadoc
---

# ICapabilityProvider

## Class signature

```java
public interface ICapabilityProvider
```

## Methods

- `boolean hasCapability(@Nonnull Capability <?> capability, @Nullable EnumFacing facing)`
- `@Nullable <T> T getCapability(@Nonnull Capability <T> capability, @Nullable EnumFacing facing)`

## Description

Retrieves the handler for the capability requested on the specific side.
