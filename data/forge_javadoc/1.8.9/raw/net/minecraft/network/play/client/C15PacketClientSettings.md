---
title: "C15PacketClientSettings"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/client"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/client/C15PacketClientSettings.html"
sourceType: javadoc
---

# C15PacketClientSettings

## Class signature

```java
public class C15PacketClientSettings extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public C15PacketClientSettings()`
- `public C15PacketClientSettings(java.lang.String langIn, int viewIn, EntityPlayer.EnumChatVisibility chatVisibilityIn, boolean enableColorsIn, int modelPartFlagsIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public java.lang.String getLang()`
- `public EntityPlayer.EnumChatVisibility getChatVisibility()`
- `public boolean isColorsEnabled()`
- `public int getModelPartFlags()`

## Description

Passes this Packet on to the NetHandler for processing.
