# ItemTooltipEvent

## Class signature

```java
public class ItemTooltipEvent extends PlayerEvent
```

## Constructors

- `public ItemTooltipEvent(@Nonnull ItemStack itemStack, EntityPlayer entityPlayer, java.util.List<java.lang.String> toolTip, boolean showAdvancedItemTooltips)`

## Methods

- `public boolean isShowAdvancedItemTooltips()`
- `@Nonnull public ItemStack getItemStack()`
- `public java.util.List<java.lang.String> getToolTip()`

## Description

This event is fired in ItemStack.getTooltip(EntityPlayer, boolean) , which in turn is called from it's respective GUIContainer.