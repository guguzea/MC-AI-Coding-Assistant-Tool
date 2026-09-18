# IPermissionHandler

## Class signature

```java
public interface IPermissionHandler
```

## Methods

- `void registerNode(java.lang.String node, DefaultPermissionLevel level, java.lang.String desc)`
- `java.util.Collection<java.lang.String> getRegisteredNodes()`
- `boolean hasPermission(com.mojang.authlib.GameProfile profile, java.lang.String node, @Nullable IContext context)`
- `java.lang.String getNodeDescription(java.lang.String node)`

## Description

Use PermissionAPI.hasPermission(GameProfile, String, IContext)