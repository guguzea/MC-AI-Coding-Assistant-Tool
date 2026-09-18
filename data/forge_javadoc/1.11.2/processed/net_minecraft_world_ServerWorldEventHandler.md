# ServerWorldEventHandler

## Class signature

```java
public class ServerWorldEventHandler extends java.lang.Object implements IWorldEventListener
```

## Constructors

- `public ServerWorldEventHandler( MinecraftServer mcServerIn, WorldServer worldServerIn)`

## Methods

- `public void spawnParticle(int particleID, boolean ignoreRange, double xCoord, double yCoord, double zCoord, double xSpeed, double ySpeed, double zSpeed, int... parameters)`
- `public void spawnParticle(int p_190570_1_, boolean p_190570_2_, boolean p_190570_3_, double p_190570_4_, double p_190570_6_, double p_190570_8_, double p_190570_10_, double p_190570_12_, double p_190570_14_, int... p_190570_16_)`
- `public void onEntityAdded( Entity entityIn)`
- `public void onEntityRemoved( Entity entityIn)`
- `public void playSoundToAllNearExcept(@Nullable EntityPlayer player, SoundEvent soundIn, SoundCategory category, double x, double y, double z, float volume, float pitch)`
- `public void markBlockRangeForRenderUpdate(int x1, int y1, int z1, int x2, int y2, int z2)`
- `public void notifyBlockUpdate( World worldIn, BlockPos pos, IBlockState oldState, IBlockState newState, int flags)`
- `public void notifyLightSet( BlockPos pos)`
- `public void playRecord( SoundEvent soundIn, BlockPos pos)`
- `public void playEvent( EntityPlayer player, int type, BlockPos blockPosIn, int data)`
- `public void broadcastSound(int soundID, BlockPos pos, int data)`
- `public void sendBlockBreakProgress(int breakerId, BlockPos pos, int progress)`