# SPacketPlayerListItem

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketPlayerListItem

## Class signature

```java
public class SPacketPlayerListItem extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketPlayerListItem()`
- `SPacketPlayerListItem(SPacketPlayerListItem.Action actionIn, EntityPlayerMP ... playersIn)`
- `SPacketPlayerListItem(SPacketPlayerListItem.Action actionIn, java.lang.Iterable<EntityPlayerMP> playersIn)`

## Methods

- `SPacketPlayerListItem.Action getAction()`
- `java.util.List<SPacketPlayerListItem.AddPlayerData> getEntries()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `java.lang.String toString()`
- `void writePacketData(PacketBuffer buf)`