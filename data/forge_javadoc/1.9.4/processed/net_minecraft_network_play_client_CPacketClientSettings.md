# CPacketClientSettings

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketClientSettings

## Class signature

```java
public class CPacketClientSettings extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketClientSettings()`
- `CPacketClientSettings(java.lang.String langIn, int renderDistanceIn, EntityPlayer.EnumChatVisibility chatVisibilityIn, boolean chatColorsIn, int modelPartsIn, EnumHandSide mainHandIn)`

## Methods

- `EntityPlayer.EnumChatVisibility getChatVisibility()`
- `java.lang.String getLang()`
- `EnumHandSide getMainHand()`
- `int getModelPartFlags()`
- `boolean isColorsEnabled()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`