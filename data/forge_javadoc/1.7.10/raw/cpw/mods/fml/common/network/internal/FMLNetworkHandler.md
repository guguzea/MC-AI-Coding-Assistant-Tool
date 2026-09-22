---
title: "FMLNetworkHandler"
description: "public class FMLNetworkHandler extends java.lang.Object"
package: "cpw/mods/fml/common/network/internal"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/network/internal/FMLNetworkHandler.html"
sourceType: javadoc
---

# FMLNetworkHandler

**Inheritance:** java.lang.Object → cpw.mods.fml.common.network.internal.FMLNetworkHandler

## Class signature

```java
public class FMLNetworkHandler extends java.lang.Object
```

## Constructors

- `FMLNetworkHandler()`

## Methods

- `static java.lang.String checkModList(FMLHandshakeMessage.ModList modListPacket, Side side)`
- `static java.lang.String checkModList(java.util.Map<java.lang.String, java.lang.String> listData, Side side)`
- `static void enhanceStatusQuery(JsonObject jsonobject)`
- `static void fmlClientHandshake(NetworkManager field_147393_d)`
- `static void fmlServerHandshake(ServerConfigurationManager scm, NetworkManager manager, EntityPlayerMP player)`
- `static java.util.List<FMLProxyPacket> forwardHandshake(FMLMessage.CompleteHandshake push, NetworkDispatcher target, Side side)`
- `static Packet getEntitySpawningPacket(Entity entity)`
- `static void makeEntitySpawnAdjustment(Entity entity, EntityPlayerMP player, int serverX, int serverY, int serverZ)`
- `static void openGui(EntityPlayer entityPlayer, java.lang.Object mod, int modGuiId, World world, int x, int y, int z)`
- `static void registerChannel(FMLContainer container, Side side)`

## Fields

- `static int LOGIN_TIMEOUT`
- `static int READ_TIMEOUT`
