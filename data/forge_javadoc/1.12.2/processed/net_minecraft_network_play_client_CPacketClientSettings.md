# CPacketClientSettings

## Class signature

```java
public class CPacketClientSettings extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketClientSettings()`
- `public CPacketClientSettings(java.lang.String langIn, int renderDistanceIn, EntityPlayer.EnumChatVisibility chatVisibilityIn, boolean chatColorsIn, int modelPartsIn, EnumHandSide mainHandIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public java.lang.String getLang()`
- `public EntityPlayer.EnumChatVisibility getChatVisibility()`
- `public boolean isColorsEnabled()`
- `public int getModelPartFlags()`
- `public EnumHandSide getMainHand()`