# LivingDestroyBlockEvent

## Class signature

```java
public class LivingDestroyBlockEvent extends LivingEvent
```

## Constructors

- `public LivingDestroyBlockEvent( EntityLivingBase entity, BlockPos pos, IBlockState state)`

## Methods

- `public IBlockState getState()`
- `public BlockPos getPos()`

## Description

Fired when the ender dragon or wither attempts to destroy a block and when ever a zombie attempts to break a door. Basically a event version of Block.canEntityDestroy(IBlockState, IBlockAccess, BlockP