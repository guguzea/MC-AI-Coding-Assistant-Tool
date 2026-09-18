# SPacketTabComplete

## Class signature

```java
public class SPacketTabComplete extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketTabComplete()`
- `public SPacketTabComplete(java.lang.String[] matchesIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public java.lang.String[] getMatches()`