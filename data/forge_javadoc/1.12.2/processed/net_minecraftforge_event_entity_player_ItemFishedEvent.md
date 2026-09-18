# ItemFishedEvent

## Class signature

```java
public class ItemFishedEvent extends PlayerEvent
```

## Constructors

- `public ItemFishedEvent(java.util.List< ItemStack > stacks, int rodDamage, EntityFishHook hook)`

## Methods

- `public int getRodDamage()`
- `public void damageRodBy(int rodDamage)`
- `public NonNullList < ItemStack > getDrops()`
- `public EntityFishHook getHookEntity()`

## Description

This event is called when a player fishes an item. This event is Cancelable Canceling the event will cause the player to receive no items at all. The hook will still take the damage specified