# SPacketChangeGameState

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketChangeGameState

## Class signature

```java
public class SPacketChangeGameState extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketChangeGameState()`
- `SPacketChangeGameState(int stateIn, float valueIn)`

## Methods

- `int getGameState()`
- `float getValue()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`

## Fields

- `static java.lang.String[] MESSAGE_NAMES`