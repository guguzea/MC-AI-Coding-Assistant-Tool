# ItemTooltipEvent

## Class signature

```java
public class ItemTooltipEvent extends PlayerEvent
```

## Constructors

- `public ItemTooltipEvent( ItemStack itemStack, EntityPlayer entityPlayer, java.util.List<java.lang.String> toolTip, ITooltipFlag flags)`

## Methods

- `public ITooltipFlag getFlags()`
- `public ItemStack getItemStack()`
- `public java.util.List<java.lang.String> getToolTip()`
- `public EntityPlayer getEntityPlayer()`

## Description

This event is fired in ItemStack.getTooltip(EntityPlayer, ITooltipFlag) , which in turn is called from it's respective GUIContainer.