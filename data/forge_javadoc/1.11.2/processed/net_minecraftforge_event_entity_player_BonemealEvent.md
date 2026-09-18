# BonemealEvent

## Class signature

```java
public class BonemealEvent extends PlayerEvent
```

## Constructors

- `public BonemealEvent( EntityPlayer player, World world, BlockPos pos, IBlockState block)`

## Methods

- `public World getWorld()`
- `public BlockPos getPos()`
- `public IBlockState getBlock()`

## Description

This event is called when a player attempts to use Bonemeal on a block. It can be canceled to completely prevent any further processing. You can also set the result to ALLOW to mark the event as proce