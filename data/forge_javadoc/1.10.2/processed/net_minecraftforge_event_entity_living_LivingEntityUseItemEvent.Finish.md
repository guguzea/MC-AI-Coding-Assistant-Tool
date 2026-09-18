# LivingEntityUseItemEvent.Finish

## Constructors

- `public Finish( EntityLivingBase entity, ItemStack item, int duration, ItemStack result)`

## Methods

- `public ItemStack getResultStack()`
- `public void setResultStack( ItemStack result)`

## Description

Fired after an item has fully finished being used. The item has been notified that it was used, and the item/result stacks reflect after that state. This means that when this is fired for a Potion, th