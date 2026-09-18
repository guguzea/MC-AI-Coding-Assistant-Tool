---
title: "IPermissionHandler"
description: "Use PermissionAPI.hasPermission(GameProfile, String, IContext)"
package: "net/minecraftforge/server/permission"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/server/permission/IPermissionHandler.html"
sourceType: javadoc
---

# IPermissionHandler

## Class signature

```java
public interface IPermissionHandler
```

## Methods

- `void registerNode(java.lang.String node, DefaultPermissionLevel level, java.lang.String desc)`
- `java.util.Collection<java.lang.String> getRegisteredNodes()`
- `boolean hasPermission(GameProfile profile, java.lang.String node, IContext context)`
- `java.lang.String getNodeDescription(java.lang.String node)`

## Description

Use PermissionAPI.hasPermission(GameProfile, String, IContext)
