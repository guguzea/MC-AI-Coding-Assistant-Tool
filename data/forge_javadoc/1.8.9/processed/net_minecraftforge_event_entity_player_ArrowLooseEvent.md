# ArrowLooseEvent

## Class signature

```java
public class ArrowLooseEvent extends PlayerEvent
```

## Constructors

- `public ArrowLooseEvent( EntityPlayer player, ItemStack bow, int charge)`

## Description

ArrowLooseEvent is fired when a player stops using a bow. This event is fired whenever a player stops using a bow in ItemBow#onPlayerStoppedUsing(ItemStack, World, EntityPlayer, int). bow contains the