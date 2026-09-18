# RenderBlockOverlayEvent

## Class signature

```java
public class RenderBlockOverlayEvent extends Event
```

## Constructors

- `public RenderBlockOverlayEvent( EntityPlayer player, float renderPartialTicks, RenderBlockOverlayEvent.OverlayType type, IBlockState block, BlockPos blockPos)`

## Methods

- `@Deprecated public RenderBlockOverlayEvent( EntityPlayer player, float renderPartialTicks, RenderBlockOverlayEvent.OverlayType type, Block block, int x, int y, int z)`

## Description

Called when a block's texture is going to be overlaid on the player's HUD. Cancel this event to prevent the overlay.