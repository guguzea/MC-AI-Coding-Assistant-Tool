# SPacketEntityProperties

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketEntityProperties

## Class signature

```java
public class SPacketEntityProperties extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketEntityProperties()`
- `SPacketEntityProperties(int entityIdIn, java.util.Collection<IAttributeInstance> instances)`

## Methods

- `int getEntityId()`
- `java.util.List<SPacketEntityProperties.Snapshot> getSnapshots()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`