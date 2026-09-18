# MinecartInteractEvent

## Class signature

```java
public class MinecartInteractEvent extends MinecartEvent
```

## Constructors

- `public MinecartInteractEvent( EntityMinecart minecart, EntityPlayer player, EnumHand hand)`

## Methods

- `public EntityPlayer getPlayer()`
- `@Nonnull public ItemStack getItem()`
- `public EnumHand getHand()`

## Description

MinecartInteractEvent is fired when a player interacts with a minecart. This event is fired whenever a player interacts with a minecart in EntityMinecartContainer.processInitialInteract(EntityPlayer,