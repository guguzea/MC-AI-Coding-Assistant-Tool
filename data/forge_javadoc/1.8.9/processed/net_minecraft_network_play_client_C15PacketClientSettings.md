# C15PacketClientSettings

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.C15PacketClientSettings

## Class signature

```java
public class C15PacketClientSettings extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `C15PacketClientSettings()`
- `C15PacketClientSettings(java.lang.String langIn, int viewIn, EntityPlayer.EnumChatVisibility chatVisibilityIn, boolean enableColorsIn, int modelPartFlagsIn)`

## Methods

- `EntityPlayer.EnumChatVisibility getChatVisibility()`
- `java.lang.String getLang()`
- `int getModelPartFlags()`
- `boolean isColorsEnabled()`
- `void processPacket(INetHandlerPlayServer handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.