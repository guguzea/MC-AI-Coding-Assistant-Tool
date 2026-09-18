# PathWorldListener

## Class signature

```java
public class PathWorldListener extends java.lang.Object implements IWorldEventListener
```

## Constructors

- `public PathWorldListener()`

## Methods

- `public void notifyBlockUpdate( World worldIn, BlockPos pos, IBlockState oldState, IBlockState newState, int flags)`
- `protected boolean didBlockChange( World worldIn, BlockPos pos, IBlockState oldState, IBlockState newState)`
- `public void notifyLightSet( BlockPos pos)`
- `public void markBlockRangeForRenderUpdate(int x1, int y1, int z1, int x2, int y2, int z2)`
- `public void playSoundToAllNearExcept( EntityPlayer player, SoundEvent soundIn, SoundCategory category, double x, double y, double z, float volume, float pitch)`
- `public void spawnParticle(int particleID, boolean ignoreRange, double xCoord, double yCoord, double zCoord, double xSpeed, double ySpeed, double zSpeed, int... parameters)`
- `public void spawnParticle(int id, boolean ignoreRange, boolean p_190570_3_, double x, double y, double z, double xSpeed, double ySpeed, double zSpeed, int... parameters)`
- `public void onEntityAdded( Entity entityIn)`
- `public void onEntityRemoved( Entity entityIn)`
- `public void playRecord( SoundEvent soundIn, BlockPos pos)`
- `public void broadcastSound(int soundID, BlockPos pos, int data)`
- `public void playEvent( EntityPlayer player, int type, BlockPos blockPosIn, int data)`
- `public void sendBlockBreakProgress(int breakerId, BlockPos pos, int progress)`