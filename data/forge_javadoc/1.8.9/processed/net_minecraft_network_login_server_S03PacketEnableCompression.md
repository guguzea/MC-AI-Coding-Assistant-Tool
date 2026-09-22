# S03PacketEnableCompression

**Inheritance:** java.lang.Object → net.minecraft.network.login.server.S03PacketEnableCompression

## Class signature

```java
public class S03PacketEnableCompression extends java.lang.Object implements Packet<INetHandlerLoginClient>
```

## Constructors

- `S03PacketEnableCompression()`
- `S03PacketEnableCompression(int compressionTresholdIn)`

## Methods

- `int getCompressionTreshold()`
- `void processPacket(INetHandlerLoginClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.