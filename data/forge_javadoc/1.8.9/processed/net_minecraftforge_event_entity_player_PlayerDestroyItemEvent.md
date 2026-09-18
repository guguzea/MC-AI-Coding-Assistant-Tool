# PlayerDestroyItemEvent

## Class signature

```java
public class PlayerDestroyItemEvent extends PlayerEvent
```

## Constructors

- `public PlayerDestroyItemEvent( EntityPlayer player, ItemStack original)`

## Description

PlayerDestroyItemEvent is fired when a player destroys an item. This event is fired whenever a player destroys an item in PlayerControllerMP#onPlayerRightClick(EntityPlayer, World, ItemStack, int, int