# S02PacketChat

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S02PacketChat

## Class signature

```java
public class S02PacketChat extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S02PacketChat()`
- `S02PacketChat(IChatComponent component)`
- `S02PacketChat(IChatComponent message, byte typeIn)`

## Methods

- `IChatComponent getChatComponent()`
- `byte getType()` — Returns the id of the area to display the text, 2 for above the action bar, anything else currently for the chat window
- `boolean isChat()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.