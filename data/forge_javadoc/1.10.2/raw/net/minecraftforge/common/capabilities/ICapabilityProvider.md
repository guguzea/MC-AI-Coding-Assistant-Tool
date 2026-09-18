---
title: "ICapabilityProvider"
description: "Retrieves the handler for the capability requested on the specific side."
package: "net/minecraftforge/common/capabilities"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/common/capabilities/ICapabilityProvider.html"
sourceType: javadoc
---

# ICapabilityProvider

## Class signature

```java
public interface ICapabilityProvider
```

## Methods

- `boolean hasCapability( Capability <?> capability, @Nullable EnumFacing facing)`
- `<T> T getCapability( Capability <T> capability, @Nullable EnumFacing facing)`

## Description

Retrieves the handler for the capability requested on the specific side.
