---
title: "IPermissionHandler"
description: "public interface IPermissionHandler"
package: "net/minecraftforge/server/permission"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/server/permission/IPermissionHandler.html"
sourceType: javadoc
---

# IPermissionHandler

## Class signature

```java
public interface IPermissionHandler
```

## Methods

- `java.lang.String getNodeDescription(java.lang.String node)`
- `java.util.Collection<java.lang.String> getRegisteredNodes()`
- `boolean hasPermission(GameProfile profile, java.lang.String node, IContext context)` — Use PermissionAPI.hasPermission(GameProfile, String, IContext)
- `void registerNode(java.lang.String node, DefaultPermissionLevel level, java.lang.String desc)` — Use PermissionAPI.registerNode(String, DefaultPermissionLevel, String)
