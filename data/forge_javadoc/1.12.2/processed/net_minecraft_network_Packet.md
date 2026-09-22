# Packet

## Class signature

```java
public interface Packet<T extends INetHandler>
```

## Methods

- `void processPacket(T handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`