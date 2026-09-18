# EnumConnectionState

## Class signature

```java
public enum EnumConnectionState extends java.lang.Enum< EnumConnectionState >
```

## Methods

- `public static EnumConnectionState [] values()`
- `public static EnumConnectionState valueOf(java.lang.String name)`
- `protected EnumConnectionState registerPacket( EnumPacketDirection direction, java.lang.Class<? extends Packet <?>> packetClass)`
- `public java.lang.Integer getPacketId( EnumPacketDirection direction, Packet <?> packetIn) throws java.lang.Exception`
- `public Packet <?> getPacket( EnumPacketDirection direction, int packetId) throws java.lang.InstantiationException, java.lang.IllegalAccessException`
- `public int getId()`
- `public static EnumConnectionState getById(int stateId)`
- `public static EnumConnectionState getFromPacket( Packet <?> packetIn)`

## Description

Returns the enum constant of this type with the specified name.