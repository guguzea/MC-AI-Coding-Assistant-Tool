# C11PacketEnchantItem

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.C11PacketEnchantItem

## Class signature

```java
public class C11PacketEnchantItem extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `C11PacketEnchantItem()`
- `C11PacketEnchantItem(int windowId, int button)`

## Methods

- `int getButton()`
- `int getWindowId()`
- `void processPacket(INetHandlerPlayServer handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.