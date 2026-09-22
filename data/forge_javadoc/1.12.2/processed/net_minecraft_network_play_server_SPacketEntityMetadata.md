# SPacketEntityMetadata

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketEntityMetadata

## Class signature

```java
public class SPacketEntityMetadata extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketEntityMetadata()`
- `SPacketEntityMetadata(int entityIdIn, EntityDataManager dataManagerIn, boolean sendAll)`

## Methods

- `java.util.List<EntityDataManager.DataEntry<?>> getDataManagerEntries()`
- `int getEntityId()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`