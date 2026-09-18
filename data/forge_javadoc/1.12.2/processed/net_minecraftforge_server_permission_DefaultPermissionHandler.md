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
- `public boolean hasPermission(GameProfile profile, java.lang.String node, IContext context)`
- `public java.lang.String getNodeDescription(java.lang.String node)`
- `public DefaultPermissionLevel getDefaultPermissionLevel(java.lang.String node)`

## Description

Default implementation of PermissionAPI. hasPermission(GameProfile, String, IContext) is based on DefaultPermissionLevel