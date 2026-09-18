# S45PacketTitle

## Class signature

```java
public class S45PacketTitle extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S45PacketTitle()`
- `public S45PacketTitle( S45PacketTitle.Type type, IChatComponent message)`
- `public S45PacketTitle(int fadeInTime, int displayTime, int fadeOutTime)`
- `public S45PacketTitle( S45PacketTitle.Type type, IChatComponent message, int fadeInTime, int displayTime, int fadeOutTime)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public S45PacketTitle.Type getType()`
- `public IChatComponent getMessage()`
- `public int getFadeInTime()`
- `public int getDisplayTime()`
- `public int getFadeOutTime()`

## Description

Passes this Packet on to the NetHandler for processing.