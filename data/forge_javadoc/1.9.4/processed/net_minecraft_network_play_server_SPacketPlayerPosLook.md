# SPacketPlayerPosLook

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketPlayerPosLook

## Class signature

```java
public class SPacketPlayerPosLook extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketPlayerPosLook()`
- `SPacketPlayerPosLook(double xIn, double yIn, double zIn, float yawIn, float pitchIn, java.util.Set<SPacketPlayerPosLook.EnumFlags> flagsIn, int teleportIdIn)`

## Methods

- `java.util.Set<SPacketPlayerPosLook.EnumFlags> getFlags()`
- `float getPitch()`
- `int getTeleportId()`
- `double getX()`
- `double getY()`
- `float getYaw()`
- `double getZ()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`