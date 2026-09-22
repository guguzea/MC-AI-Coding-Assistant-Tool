---
title: "DefaultPermissionHandler"
description: "public enum DefaultPermissionHandler extends java.lang.Enum<DefaultPermissionHandler> implements IPermissionHandler"
package: "net/minecraftforge/server/permission"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/server/permission/DefaultPermissionHandler.html"
sourceType: javadoc
---

# DefaultPermissionHandler

**Inheritance:** java.lang.Object → java.lang.Enum<DefaultPermissionHandler> → net.minecraftforge.server.permission.DefaultPermissionHandler

## Class signature

```java
public enum DefaultPermissionHandler extends java.lang.Enum<DefaultPermissionHandler> implements IPermissionHandler
```

## Methods

- `DefaultPermissionLevel getDefaultPermissionLevel(java.lang.String node)`
- `java.lang.String getNodeDescription(java.lang.String node)`
- `java.util.Collection<java.lang.String> getRegisteredNodes()`
- `boolean hasPermission(GameProfile profile, java.lang.String node, IContext context)` — Use PermissionAPI.hasPermission(GameProfile, String, IContext)
- `void registerNode(java.lang.String node, DefaultPermissionLevel level, java.lang.String desc)` — Use PermissionAPI.registerNode(String, DefaultPermissionLevel, String)
- `static DefaultPermissionHandler valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static DefaultPermissionHandler [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.
