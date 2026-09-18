# SPacketChangeGameState

## Class signature

```java
public class SPacketChangeGameState extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketChangeGameState()`
- `public SPacketChangeGameState(int stateIn, float valueIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getGameState()`
- `public float getValue()`