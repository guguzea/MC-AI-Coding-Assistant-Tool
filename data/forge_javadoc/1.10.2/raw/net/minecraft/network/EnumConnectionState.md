---
title: "EnumConnectionState"
description: "Returns the enum constant of this type with the specified name."
package: "net/minecraft/network"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/EnumConnectionState.html"
sourceType: javadoc
---

# EnumConnectionState

## Class signature

```java
public enum EnumConnectionState extends java.lang.Enum< EnumConnectionState >
```

## Methods

- `public static EnumConnectionState [] values()`
- `public static EnumConnectionState valueOf(java.lang.String name)`
- `protected EnumConnectionState registerPacket( EnumPacketDirection direction, java.lang.Class<? extends Packet <?>> packetClass)`
- `public java.lang.Integer getPacketId( EnumPacketDirection direction, Packet <?> packetIn)`
- `@Nullable public Packet <?> getPacket( EnumPacketDirection direction, int packetId) throws java.lang.InstantiationException, java.lang.IllegalAccessException`
- `public int getId()`
- `public static EnumConnectionState getById(int stateId)`
- `public static EnumConnectionState getFromPacket( Packet <?> packetIn)`

## Description

Returns the enum constant of this type with the specified name.
