# SPacketUpdateHealth

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketUpdateHealth

## Class signature

```java
public class SPacketUpdateHealth extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketUpdateHealth()`
- `SPacketUpdateHealth(float healthIn, int foodLevelIn, float saturationLevelIn)`

## Methods

- `int getFoodLevel()`
- `float getHealth()`
- `float getSaturationLevel()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`