# S3APacketTabComplete

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S3APacketTabComplete

## Class signature

```java
public class S3APacketTabComplete extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S3APacketTabComplete()`
- `S3APacketTabComplete(java.lang.String[] matchesIn)`

## Methods

- `java.lang.String[] func_149630_c()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.