# CPacketEnchantItem

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketEnchantItem

## Class signature

```java
public class CPacketEnchantItem extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketEnchantItem()`
- `CPacketEnchantItem(int windowIdIn, int buttonIn)`

## Methods

- `int getButton()`
- `int getWindowId()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`