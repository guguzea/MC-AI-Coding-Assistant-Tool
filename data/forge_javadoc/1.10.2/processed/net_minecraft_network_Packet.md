# Packet

## Class signature

```java
public interface Packet<T extends INetHandler >
```

## Methods

- `void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `void processPacket( T handler)`