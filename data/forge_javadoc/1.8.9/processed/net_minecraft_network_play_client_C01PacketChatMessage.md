# C01PacketChatMessage

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.C01PacketChatMessage

## Class signature

```java
public class C01PacketChatMessage extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `C01PacketChatMessage()`
- `C01PacketChatMessage(java.lang.String messageIn)`

## Methods

- `java.lang.String getMessage()`
- `void processPacket(INetHandlerPlayServer handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.