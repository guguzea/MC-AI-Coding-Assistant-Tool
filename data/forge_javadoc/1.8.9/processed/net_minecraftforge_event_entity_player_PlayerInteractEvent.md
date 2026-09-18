# PlayerInteractEvent

## Class signature

```java
public class PlayerInteractEvent extends PlayerEvent
```

## Constructors

- `public PlayerInteractEvent( EntityPlayer player, PlayerInteractEvent.Action action, BlockPos pos, EnumFacing face, World world, Vec3 localPos)`

## Methods

- `@Deprecated public PlayerInteractEvent( EntityPlayer player, PlayerInteractEvent.Action action, BlockPos pos, EnumFacing face, World world)`
- `public void setCanceled(boolean cancel)`

## Description

PlayerInteractEvent is fired when a player interacts in some way. This event is fired whenever a player interacts in Minecraft#rightClickMouse(), NetHandlerPlayServer#processPlayerBlockPlacement(C08Pa