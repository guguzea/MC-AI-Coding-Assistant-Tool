---
title: "ServerData"
description: "public class ServerData extends java.lang.Object"
package: "net/minecraft/client/multiplayer"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/client/multiplayer/ServerData.html"
sourceType: javadoc
---

# ServerData

## Class signature

```java
public class ServerData extends java.lang.Object
```

## Constructors

- `public ServerData(java.lang.String name, java.lang.String ip, boolean isLan)`

## Methods

- `public NBTTagCompound getNBTCompound()`
- `public ServerData.ServerResourceMode getResourceMode()`
- `public void setResourceMode( ServerData.ServerResourceMode mode)`
- `public static ServerData getServerDataFromNBTCompound( NBTTagCompound nbtCompound)`
- `public java.lang.String getBase64EncodedIconData()`
- `public void setBase64EncodedIconData(java.lang.String icon)`
- `public boolean isOnLAN()`
- `public void copyFrom( ServerData serverDataIn)`
