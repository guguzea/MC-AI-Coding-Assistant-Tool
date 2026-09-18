# SPacketDisplayObjective

## Class signature

```java
public class SPacketDisplayObjective extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketDisplayObjective()`
- `public SPacketDisplayObjective(int positionIn, ScoreObjective objective)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getPosition()`
- `public java.lang.String getName()`