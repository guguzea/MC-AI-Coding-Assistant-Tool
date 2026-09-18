# MinecartInteractEvent

## Class signature

```java
public class MinecartInteractEvent extends MinecartEvent
```

## Constructors

- `public MinecartInteractEvent( EntityMinecart minecart, EntityPlayer player, ItemStack item, EnumHand hand)`

## Methods

- `public EntityPlayer getPlayer()`
- `public ItemStack getItem()`
- `public EnumHand getHand()`

## Description

MinecartInteractEvent is fired when a player interacts with a minecart. This event is fired whenever a player interacts with a minecart in EntityMinecartContainer.processInitialInteract(EntityPlayer,