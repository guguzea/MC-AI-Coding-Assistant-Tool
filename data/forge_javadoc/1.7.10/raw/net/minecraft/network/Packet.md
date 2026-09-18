---
title: "Packet"
description: "public abstract class Packet extends java.lang.Object"
package: "net/minecraft/network"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/network/Packet.html"
sourceType: javadoc
---

# Packet

## Class signature

```java
public abstract class Packet extends java.lang.Object
```

## Constructors

- `public Packet()`

## Methods

- `public static Packet generatePacket(BiMap p_148839_0_, int p_148839_1_)`
- `public static void writeBlob(ByteBuf p_148838_0_, byte[] p_148838_1_)`
- `public static byte[] readBlob(ByteBuf p_148834_0_) throws java.io.IOException`
- `public abstract void readPacketData( PacketBuffer p_148837_1_) throws java.io.IOException`
- `public abstract void writePacketData( PacketBuffer p_148840_1_) throws java.io.IOException`
- `public abstract void processPacket( INetHandler p_148833_1_)`
- `public boolean hasPriority()`
- `public java.lang.String toString()`
- `public java.lang.String serialize()`
