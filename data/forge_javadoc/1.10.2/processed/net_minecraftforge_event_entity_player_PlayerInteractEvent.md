# PlayerInteractEvent

## Class signature

```java
public class PlayerInteractEvent extends PlayerEvent
```

## Methods

- `public EnumHand getHand()`
- `@Nullable public ItemStack getItemStack()`
- `public BlockPos getPos()`
- `@Nullable public EnumFacing getFace()`
- `public World getWorld()`
- `public Side getSide()`

## Description

PlayerInteractEvent is fired when a player interacts in some way. All subclasses are fired on MinecraftForge.EVENT_BUS . See the individual documentation on each subevent for more details.