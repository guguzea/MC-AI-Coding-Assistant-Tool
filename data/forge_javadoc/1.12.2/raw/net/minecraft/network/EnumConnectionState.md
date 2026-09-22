---
title: "EnumConnectionState"
description: "public enum EnumConnectionState extends java.lang.Enum<EnumConnectionState>"
package: "net/minecraft/network"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/EnumConnectionState.html"
sourceType: javadoc
---

# EnumConnectionState

**Inheritance:** java.lang.Object → java.lang.Enum<EnumConnectionState> → net.minecraft.network.EnumConnectionState

## Class signature

```java
public enum EnumConnectionState extends java.lang.Enum<EnumConnectionState>
```

## Methods

- `static EnumConnectionState getById(int stateId)`
- `static EnumConnectionState getFromPacket(Packet<?> packetIn)`
- `int getId()`
- `Packet<?> getPacket(EnumPacketDirection direction, int packetId)`
- `java.lang.Integer getPacketId(EnumPacketDirection direction, Packet<?> packetIn)`
- `protected EnumConnectionState registerPacket(EnumPacketDirection direction, java.lang.Class<? extends Packet<?>> packetClass)`
- `static EnumConnectionState valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static EnumConnectionState [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.
