---
title: "FMLNetworkHandler"
description: "public class FMLNetworkHandler extends java.lang.Object"
package: "net/minecraftforge/fml/common/network/internal"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/common/network/internal/FMLNetworkHandler.html"
sourceType: javadoc
---

# FMLNetworkHandler

## Class signature

```java
public class FMLNetworkHandler extends java.lang.Object
```

## Constructors

- `public FMLNetworkHandler()`

## Methods

- `public static void fmlServerHandshake( PlayerList scm, NetworkManager manager, EntityPlayerMP player)`
- `public static void fmlClientHandshake( NetworkManager networkManager)`
- `public static void openGui( EntityPlayer entityPlayer, java.lang.Object mod, int modGuiId, World world, int x, int y, int z)`
- `@Nullable public static Packet <?> getEntitySpawningPacket( Entity entity)`
- `@Nullable public static java.lang.String checkModList( FMLHandshakeMessage.ModList modListPacket, Side side)`
- `@Nullable public static java.lang.String checkModList(java.util.Map<java.lang.String,java.lang.String> listData, Side side)`
- `public static void registerChannel( FMLContainer container, Side side)`
- `public static java.util.List< FMLProxyPacket > forwardHandshake( FMLMessage.CompleteHandshake push, NetworkDispatcher target, Side side)`
- `public static void enhanceStatusQuery(com.google.gson.JsonObject jsonobject)`
