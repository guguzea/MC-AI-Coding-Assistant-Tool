# CPacketSeenAdvancements

## Class signature

```java
public class CPacketSeenAdvancements extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketSeenAdvancements()`
- `public CPacketSeenAdvancements( CPacketSeenAdvancements.Action p_i47595_1_, ResourceLocation p_i47595_2_)`

## Methods

- `public static CPacketSeenAdvancements openedTab( Advancement p_194163_0_)`
- `public static CPacketSeenAdvancements closedScreen()`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public CPacketSeenAdvancements.Action getAction()`
- `public ResourceLocation getTab()`