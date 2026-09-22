# CPacketSeenAdvancements

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketSeenAdvancements

## Class signature

```java
public class CPacketSeenAdvancements extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketSeenAdvancements()`
- `CPacketSeenAdvancements(CPacketSeenAdvancements.Action p_i47595_1_, ResourceLocation p_i47595_2_)`

## Methods

- `static CPacketSeenAdvancements closedScreen()`
- `CPacketSeenAdvancements.Action getAction()`
- `ResourceLocation getTab()`
- `static CPacketSeenAdvancements openedTab(Advancement p_194163_0_)`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`