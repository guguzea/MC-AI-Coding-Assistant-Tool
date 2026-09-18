# ArrowNockEvent

## Class signature

```java
public class ArrowNockEvent extends PlayerEvent
```

## Constructors

- `public ArrowNockEvent( EntityPlayer player, ItemStack item, EnumHand hand, World world, boolean hasAmmo)`

## Methods

- `public ItemStack getBow()`
- `public World getWorld()`
- `public EnumHand getHand()`
- `public boolean hasAmmo()`
- `public ActionResult < ItemStack > getAction()`
- `public void setAction( ActionResult < ItemStack > action)`

## Description

ArrowNockEvent is fired when a player begins using a bow. This event is fired whenever a player begins using a bow in ItemBow#onItemRightClick(ItemStack, World, EntityPlayer). This event is fired on t