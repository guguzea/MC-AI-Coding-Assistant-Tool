# VanillaInventoryCodeHooks

**Inheritance:** java.lang.Object → net.minecraftforge.items.VanillaInventoryCodeHooks

## Class signature

```java
public class VanillaInventoryCodeHooks extends java.lang.Object
```

## Constructors

- `VanillaInventoryCodeHooks()`

## Methods

- `static boolean dropperInsertHook(World world, BlockPos pos, TileEntityDispenser dropper, int slot, ItemStack stack)` — Copied from BlockDropper#dispense and added capability support
- `static java.lang.Boolean extractHook(IHopper dest)` — Copied from TileEntityHopper#captureDroppedItems and added capability support
- `static<any> getItemHandler(World worldIn, double x, double y, double z, EnumFacing side)`
- `static boolean insertHook(TileEntityHopper hopper)` — Copied from TileEntityHopper#transferItemsOut and added capability support