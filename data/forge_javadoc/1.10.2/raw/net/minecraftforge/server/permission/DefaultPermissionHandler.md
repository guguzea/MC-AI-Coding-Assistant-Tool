---
title: "DefaultPermissionHandler"
description: "Default implementation of PermissionAPI. hasPermission(GameProfile, String, IContext) is based on DefaultPermissionLevel"
package: "net/minecraftforge/server/permission"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/server/permission/DefaultPermissionHandler.html"
sourceType: javadoc
---

# DefaultPermissionHandler

## Class signature

```java
public enum DefaultPermissionHandler extends java.lang.Enum< DefaultPermissionHandler > implements IPermissionHandler
```

## Methods

- `public static DefaultPermissionHandler [] values()`
- `public static DefaultPermissionHandler valueOf(java.lang.String name)`
- `public void registerNode(java.lang.String node, DefaultPermissionLevel level, java.lang.String desc)`
- `public java.util.Collection<java.lang.String> getRegisteredNodes()`
- `public boolean hasPermission(com.mojang.authlib.GameProfile profile, java.lang.String node, @Nullable IContext context)`
- `public java.lang.String getNodeDescription(java.lang.String node)`
- `public DefaultPermissionLevel getDefaultPermissionLevel(java.lang.String node)`

## Description

Default implementation of PermissionAPI. hasPermission(GameProfile, String, IContext) is based on DefaultPermissionLevel
