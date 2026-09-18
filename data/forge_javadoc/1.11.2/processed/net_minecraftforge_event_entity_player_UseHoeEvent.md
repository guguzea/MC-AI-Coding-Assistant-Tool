# UseHoeEvent

## Class signature

```java
public class UseHoeEvent extends PlayerEvent
```

## Constructors

- `public UseHoeEvent( EntityPlayer player, @Nonnull ItemStack current, World world, BlockPos pos)`

## Methods

- `@Nonnull public ItemStack getCurrent()`
- `public World getWorld()`
- `public BlockPos getPos()`

## Description

This event is fired when a player attempts to use a Hoe on a block, it can be canceled to completely prevent any further processing. You can also set the result to ALLOW to mark the event as processed