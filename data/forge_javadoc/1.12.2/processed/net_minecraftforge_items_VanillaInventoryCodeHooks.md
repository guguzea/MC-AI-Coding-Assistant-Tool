# VanillaInventoryCodeHooks

## Class signature

```java
public class VanillaInventoryCodeHooks extends java.lang.Object
```

## Constructors

- `public VanillaInventoryCodeHooks()`

## Methods

- `public static java.lang.Boolean extractHook( IHopper dest)`
- `public static boolean dropperInsertHook( World world, BlockPos pos, TileEntityDispenser dropper, int slot, ItemStack stack)`
- `public static boolean insertHook( TileEntityHopper hopper)`
- `public static <any> getItemHandler( World worldIn, double x, double y, double z, EnumFacing side)`

## Description

Copied from BlockDropper#dispense and added capability support