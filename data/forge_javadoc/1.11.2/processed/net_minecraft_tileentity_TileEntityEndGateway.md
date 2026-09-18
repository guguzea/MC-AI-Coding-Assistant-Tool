# TileEntityEndGateway

## Class signature

```java
public class TileEntityEndGateway extends TileEntityEndPortal implements ITickable
```

## Constructors

- `public TileEntityEndGateway()`

## Methods

- `public NBTTagCompound writeToNBT( NBTTagCompound compound)`
- `public void readFromNBT( NBTTagCompound compound)`
- `public double getMaxRenderDistanceSquared()`
- `public void update()`
- `public boolean isSpawning()`
- `public boolean isCoolingDown()`
- `public float getSpawnPercent(float p_184302_1_)`
- `public float getCooldownPercent(float p_184305_1_)`
- `@Nullable public SPacketUpdateTileEntity getUpdatePacket()`
- `public NBTTagCompound getUpdateTag()`
- `public void triggerCooldown()`
- `public boolean receiveClientEvent(int id, int type)`
- `public void teleportEntity( Entity entityIn)`
- `public boolean shouldRenderFace( EnumFacing p_184313_1_)`
- `public int getParticleAmount()`
- `public void setExactPosition( BlockPos p_190603_1_)`