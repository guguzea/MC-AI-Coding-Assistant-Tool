# SPacketSetExperience

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketSetExperience

## Class signature

```java
public class SPacketSetExperience extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketSetExperience()`
- `SPacketSetExperience(float experienceBarIn, int totalExperienceIn, int levelIn)`

## Methods

- `float getExperienceBar()`
- `int getLevel()`
- `int getTotalExperience()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`