# SPacketPlayerAbilities

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketPlayerAbilities

## Class signature

```java
public class SPacketPlayerAbilities extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketPlayerAbilities()`
- `SPacketPlayerAbilities(PlayerCapabilities capabilities)`

## Methods

- `float getFlySpeed()`
- `float getWalkSpeed()`
- `boolean isAllowFlying()`
- `boolean isCreativeMode()`
- `boolean isFlying()`
- `boolean isInvulnerable()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void setAllowFlying(boolean isAllowFlying)`
- `void setCreativeMode(boolean isCreativeMode)`
- `void setFlying(boolean isFlying)`
- `void setFlySpeed(float flySpeedIn)`
- `void setInvulnerable(boolean isInvulnerable)`
- `void setWalkSpeed(float walkSpeedIn)`
- `void writePacketData(PacketBuffer buf)`