---
title: "PermissionAPI"
description: "public class PermissionAPI extends java.lang.Object"
package: "net/minecraftforge/server/permission"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/server/permission/PermissionAPI.html"
sourceType: javadoc
---

# PermissionAPI

**Inheritance:** java.lang.Object → net.minecraftforge.server.permission.PermissionAPI

## Class signature

```java
public class PermissionAPI extends java.lang.Object
```

## Constructors

- `PermissionAPI()`

## Methods

- `static IPermissionHandler getPermissionHandler()`
- `static boolean hasPermission(EntityPlayer player, java.lang.String node)` — Shortcut method using EntityPlayer and creating PlayerContext
- `static boolean hasPermission(com.mojang.authlib.GameProfile profile, java.lang.String node, IContext context)`
- `static java.lang.String registerNode(java.lang.String node, DefaultPermissionLevel level, java.lang.String desc)` — Only use this after PreInit state!
- `static void setPermissionHandler(IPermissionHandler handler)` — Only use this in PreInit state!
