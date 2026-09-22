---
title: "IntegratedPlayerList"
description: "public class IntegratedPlayerList extends ServerConfigurationManager"
package: "net/minecraft/server/integrated"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/server/integrated/IntegratedPlayerList.html"
sourceType: javadoc
---

# IntegratedPlayerList

**Inheritance:** java.lang.Object → net.minecraft.server.management.ServerConfigurationManager → net.minecraft.server.integrated.IntegratedPlayerList

## Class signature

```java
public class IntegratedPlayerList extends ServerConfigurationManager
```

## Methods

- `java.lang.String allowUserToConnect(java.net.SocketAddress address, GameProfile profile)` — checks ban-lists, then white-lists, then space for the server.
- `NBTTagCompound getHostPlayerData()` — On integrated servers, returns the host's player data to be written to level.dat.
- `IntegratedServer getServerInstance()`
- `protected void writePlayerData(EntityPlayerMP playerIn)` — also stores the NBTTags if this is an intergratedPlayerList

## Fields

- `IntegratedPlayerList`
