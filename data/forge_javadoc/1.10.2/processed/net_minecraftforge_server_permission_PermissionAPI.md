# PermissionAPI

## Class signature

```java
public class PermissionAPI extends java.lang.Object
```

## Constructors

- `public PermissionAPI()`

## Methods

- `public static void setPermissionHandler( IPermissionHandler handler)`
- `public static IPermissionHandler getPermissionHandler()`
- `public static java.lang.String registerNode(java.lang.String node, DefaultPermissionLevel level, java.lang.String desc)`
- `public static boolean hasPermission(com.mojang.authlib.GameProfile profile, java.lang.String node, @Nullable IContext context)`
- `public static boolean hasPermission( EntityPlayer player, java.lang.String node)`

## Description

Shortcut method using EntityPlayer and creating PlayerContext