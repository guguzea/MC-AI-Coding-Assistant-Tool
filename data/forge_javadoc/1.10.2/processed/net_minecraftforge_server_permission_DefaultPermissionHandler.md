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
- `boolean hasPermission(com.mojang.authlib.GameProfile profile, java.lang.String node, IContext context)` — Use PermissionAPI.hasPermission(GameProfile, String, IContext)
- `void registerNode(java.lang.String node, DefaultPermissionLevel level, java.lang.String desc)` — Use PermissionAPI.registerNode(String, DefaultPermissionLevel, String)
- `static DefaultPermissionHandler valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static DefaultPermissionHandler [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.