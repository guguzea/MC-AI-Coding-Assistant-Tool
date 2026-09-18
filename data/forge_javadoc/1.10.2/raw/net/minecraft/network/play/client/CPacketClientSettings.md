---
title: "CPacketClientSettings"
description: "public class CPacketClientSettings extends java.lang.Object implements Packet < INetHandlerPlayServer >"
package: "net/minecraft/network/play/client"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/client/CPacketClientSettings.html"
sourceType: javadoc
---

# CPacketClientSettings

## Class signature

```java
public class CPacketClientSettings extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketClientSettings()`
- `public CPacketClientSettings(java.lang.String langIn, int renderDistanceIn, EntityPlayer.EnumChatVisibility chatVisibilityIn, boolean chatColorsIn, int modelPartsIn, EnumHandSide mainHandIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public java.lang.String getLang()`
- `public EntityPlayer.EnumChatVisibility getChatVisibility()`
- `public boolean isColorsEnabled()`
- `public int getModelPartFlags()`
- `public EnumHandSide getMainHand()`
