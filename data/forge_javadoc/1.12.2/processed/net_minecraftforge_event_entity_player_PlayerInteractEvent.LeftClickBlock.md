# PlayerInteractEvent.LeftClickBlock

## Constructors

- `public LeftClickBlock( EntityPlayer player, BlockPos pos, EnumFacing face, Vec3d hitVec)`

## Methods

- `public Vec3d getHitVec()`
- `public Event.Result getUseBlock()`
- `public Event.Result getUseItem()`
- `public void setUseBlock( Event.Result triggerBlock)`
- `public void setUseItem( Event.Result triggerItem)`
- `public void setCanceled(boolean canceled)`

## Description

This event is fired when a player left clicks while targeting a block. This event controls which of Block.onBlockClicked(net.minecraft.world.World, net.minecraft.util.math.BlockPos, net.minecraft.enti