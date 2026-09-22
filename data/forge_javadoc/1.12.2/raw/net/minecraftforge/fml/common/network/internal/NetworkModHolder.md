---
title: "NetworkModHolder"
description: "public class NetworkModHolder extends java.lang.Object"
package: "net/minecraftforge/fml/common/network/internal"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/network/internal/NetworkModHolder.html"
sourceType: javadoc
---

# NetworkModHolder

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.network.internal.NetworkModHolder

## Class signature

```java
public class NetworkModHolder extends java.lang.Object
```

## Constructors

- `NetworkModHolder(ModContainer container)`
- `NetworkModHolder(ModContainer container, java.lang.Class<?> modClass, java.lang.String acceptableVersionRange, ASMDataTable table)`
- `NetworkModHolder(ModContainer container, NetworkModHolder.NetworkChecker checker)`

## Methods

- `boolean acceptsVanilla(Side from)`
- `boolean acceptVersion(java.lang.String version)`
- `boolean check(java.util.Map<java.lang.String, java.lang.String> data, Side side)`
- `java.lang.String checkCompatible(java.util.Map<java.lang.String, java.lang.String> data, Side side)`
- `ModContainer getContainer()`
- `int getLocalId()`
- `int getNetworkId()`
- `void setNetworkId(int value)`
- `void testVanillaAcceptance()`
