# EnumConnectionState

**Inheritance:** java.lang.Object → java.lang.Enum<EnumConnectionState> → net.minecraft.network.EnumConnectionState

## Class signature

```java
public enum EnumConnectionState extends java.lang.Enum<EnumConnectionState>
```

## Methods

- `static EnumConnectionState getById(int stateId)`
- `static EnumConnectionState getFromPacket(Packet packetIn)`
- `int getId()`
- `Packet getPacket(EnumPacketDirection direction, int packetId)`
- `java.lang.Integer getPacketId(EnumPacketDirection direction, Packet packetIn)`
- `protected EnumConnectionState registerPacket(EnumPacketDirection direction, java.lang.Class<? extends Packet> packetClass)`
- `static EnumConnectionState valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static EnumConnectionState [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.