# ItemTooltipEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.ItemTooltipEvent

## Class signature

```java
public class ItemTooltipEvent extends PlayerEvent
```

## Constructors

- `ItemTooltipEvent(ItemStack itemStack, EntityPlayer entityPlayer, java.util.List<java.lang.String> toolTip, boolean showAdvancedItemTooltips)`

## Methods

- `ItemStack getItemStack()` — The ItemStack with the tooltip.
- `java.util.List<java.lang.String> getToolTip()` — The ItemStack tooltip.
- `boolean isShowAdvancedItemTooltips()` — Whether the advanced information on item tooltips is being shown, toggled by F3+H.