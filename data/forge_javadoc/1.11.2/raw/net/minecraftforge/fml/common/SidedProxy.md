---
title: "SidedProxy"
description: "Sided proxies are loaded based on the specific environment they find themselves loaded into. They are used to ensure that client-specific code (such as GUIs) is only loaded into the game on the client"
package: "net/minecraftforge/fml/common"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/common/SidedProxy.html"
sourceType: javadoc
---

# SidedProxy

## Class signature

```java
public class MySidedProxyHolder { {@literal @}SidedProxy(modId="MyModId",clientSide="mymod.ClientProxy", serverSide="mymod.CommonProxy") public static CommonProxy proxy; } public class CommonProxy { // Common or server stuff here that needs to be overridden on the client } public class ClientProxy extends CommonProxy { // Override common stuff with client specific stuff here }
```

## Description

Sided proxies are loaded based on the specific environment they find themselves loaded into. They are used to ensure that client-specific code (such as GUIs) is only loaded into the game on the client
