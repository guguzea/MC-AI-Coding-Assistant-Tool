---
title: "NetworkModHolder"
description: "public class NetworkModHolder extends java.lang.Object"
package: "net/minecraftforge/fml/common/network/internal"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/network/internal/NetworkModHolder.html"
sourceType: javadoc
---

# NetworkModHolder

## Class signature

```java
public class NetworkModHolder extends java.lang.Object
```

## Constructors

- `public NetworkModHolder( ModContainer container)`
- `public NetworkModHolder( ModContainer container, NetworkModHolder.NetworkChecker checker)`
- `public NetworkModHolder( ModContainer container, java.lang.Class<?> modClass, java.lang.String acceptableVersionRange, ASMDataTable table)`

## Methods

- `public boolean acceptVersion(java.lang.String version)`
- `public boolean check(java.util.Map<java.lang.String,java.lang.String> data, Side side)`
- `public int getLocalId()`
- `public int getNetworkId()`
- `public ModContainer getContainer()`
- `public void setNetworkId(int value)`
- `public void testVanillaAcceptance()`
- `public boolean acceptsVanilla( Side from)`
