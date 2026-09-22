# S45PacketTitle

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S45PacketTitle

## Class signature

```java
public class S45PacketTitle extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S45PacketTitle()`
- `S45PacketTitle(int fadeInTime, int displayTime, int fadeOutTime)`
- `S45PacketTitle(S45PacketTitle.Type type, IChatComponent message)`
- `S45PacketTitle(S45PacketTitle.Type type, IChatComponent message, int fadeInTime, int displayTime, int fadeOutTime)`

## Methods

- `int getDisplayTime()`
- `int getFadeInTime()`
- `int getFadeOutTime()`
- `IChatComponent getMessage()`
- `S45PacketTitle.Type getType()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.