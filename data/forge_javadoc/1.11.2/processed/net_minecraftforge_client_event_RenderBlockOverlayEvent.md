# RenderBlockOverlayEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.client.event.RenderBlockOverlayEvent

## Class signature

```java
public class RenderBlockOverlayEvent extends Event
```

## Constructors

- `@Deprecated RenderBlockOverlayEvent(EntityPlayer player, float renderPartialTicks, RenderBlockOverlayEvent.OverlayType type, Block block, int x, int y, int z)`
- `RenderBlockOverlayEvent(EntityPlayer player, float renderPartialTicks, RenderBlockOverlayEvent.OverlayType type, IBlockState block, BlockPos blockPos)`

## Methods

- `IBlockState getBlockForOverlay()` — If the overlay type is BLOCK, then this is the block which the overlay is getting it's icon from
- `BlockPos getBlockPos()`
- `RenderBlockOverlayEvent.OverlayType getOverlayType()` — The type of overlay to occur
- `EntityPlayer getPlayer()` — The player which the overlay will apply to
- `float getRenderPartialTicks()`