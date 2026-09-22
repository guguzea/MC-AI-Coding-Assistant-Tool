# DemoWorldManager

**Inheritance:** java.lang.Object → net.minecraft.server.management.PlayerInteractionManager → net.minecraft.world.demo.DemoWorldManager

## Class signature

```java
public class DemoWorldManager extends PlayerInteractionManager
```

## Methods

- `void blockRemoving(BlockPos pos)`
- `void onBlockClicked(BlockPos pos, EnumFacing side)`
- `EnumActionResult processRightClick(EntityPlayer player, World worldIn, ItemStack stack, EnumHand hand)`
- `EnumActionResult processRightClickBlock(EntityPlayer player, World worldIn, ItemStack stack, EnumHand hand, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `boolean tryHarvestBlock(BlockPos pos)`
- `void updateBlockRemoving()`

## Fields

- `DemoWorldManager`