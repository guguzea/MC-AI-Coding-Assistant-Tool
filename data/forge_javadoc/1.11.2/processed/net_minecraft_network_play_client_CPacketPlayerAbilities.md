# CPacketPlayerAbilities

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketPlayerAbilities

## Class signature

```java
public class CPacketPlayerAbilities extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketPlayerAbilities()`
- `CPacketPlayerAbilities(PlayerCapabilities capabilities)`

## Methods

- `boolean isAllowFlying()`
- `boolean isCreativeMode()`
- `boolean isFlying()`
- `boolean isInvulnerable()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void setAllowFlying(boolean isAllowFlying)`
- `void setCreativeMode(boolean isCreativeMode)`
- `void setFlying(boolean isFlying)`
- `void setFlySpeed(float flySpeedIn)`
- `void setInvulnerable(boolean isInvulnerable)`
- `void setWalkSpeed(float walkSpeedIn)`
- `void writePacketData(PacketBuffer buf)`