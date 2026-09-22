---
title: "ServerData"
description: "public class ServerData extends java.lang.Object"
package: "net/minecraft/client/multiplayer"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/multiplayer/ServerData.html"
sourceType: javadoc
---

# ServerData

**Inheritance:** java.lang.Object → net.minecraft.client.multiplayer.ServerData

## Class signature

```java
public class ServerData extends java.lang.Object
```

## Constructors

- `ServerData(java.lang.String name, java.lang.String ip, boolean isLan)`

## Methods

- `void copyFrom(ServerData serverDataIn)`
- `java.lang.String getBase64EncodedIconData()`
- `NBTTagCompound getNBTCompound()`
- `ServerData.ServerResourceMode getResourceMode()`
- `static ServerData getServerDataFromNBTCompound(NBTTagCompound nbtCompound)`
- `boolean isOnLAN()`
- `void setBase64EncodedIconData(java.lang.String icon)`
- `void setResourceMode(ServerData.ServerResourceMode mode)`

## Fields

- `java.lang.String gameVersion`
- `boolean pinged`
- `long pingToServer`
- `java.lang.String playerList`
- `java.lang.String populationInfo`
- `java.lang.String serverIP`
- `java.lang.String serverMOTD`
- `java.lang.String serverName`
- `int version`
