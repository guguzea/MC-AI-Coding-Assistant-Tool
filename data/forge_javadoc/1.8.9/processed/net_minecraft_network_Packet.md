# Packet

## Class signature

```java
public interface Packet<T extends INetHandler>
```

## Methods

- `void processPacket(T handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.