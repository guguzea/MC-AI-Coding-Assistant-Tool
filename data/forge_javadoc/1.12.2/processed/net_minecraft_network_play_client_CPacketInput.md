# CPacketInput

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketInput

## Class signature

```java
public class CPacketInput extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketInput()`
- `CPacketInput(float strafeSpeedIn, float forwardSpeedIn, boolean jumpingIn, boolean sneakingIn)`

## Methods

- `float getForwardSpeed()`
- `float getStrafeSpeed()`
- `boolean isJumping()`
- `boolean isSneaking()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`