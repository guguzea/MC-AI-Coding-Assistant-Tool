# ArrowLooseEvent

## Class signature

```java
public class ArrowLooseEvent extends PlayerEvent
```

## Constructors

- `public ArrowLooseEvent( EntityPlayer player, ItemStack bow, World world, int charge, boolean hasAmmo)`

## Methods

- `public ItemStack getBow()`
- `public World getWorld()`
- `public boolean hasAmmo()`
- `public int getCharge()`
- `public void setCharge(int charge)`

## Description

ArrowLooseEvent is fired when a player stops using a bow. This event is fired whenever a player stops using a bow in ItemBow.onPlayerStoppedUsing(ItemStack, World, EntityLivingBase, int) . bow contain