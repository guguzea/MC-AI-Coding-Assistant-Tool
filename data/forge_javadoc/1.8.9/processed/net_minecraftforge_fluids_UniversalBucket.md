# UniversalBucket

**Inheritance:** java.lang.Object → net.minecraft.item.Item → net.minecraftforge.fluids.UniversalBucket

## Class signature

```java
public class UniversalBucket extends Item implements IFluidContainerItem
```

## Constructors

- `UniversalBucket()`
- `UniversalBucket(int capacity, ItemStack empty, boolean nbtSensitive)`

## Methods

- `FluidStack drain(ItemStack container, int maxDrain, boolean doDrain)`
- `int fill(ItemStack container, FluidStack resource, boolean doFill)`
- `int getCapacity(ItemStack container)`
- `static ItemStack getFilledBucket(UniversalBucket item, Fluid fluid)`
- `FluidStack getFluid(ItemStack container)`
- `java.lang.String getItemStackDisplayName(ItemStack stack)`
- `void getSubItems(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> subItems)` — returns a list of items with the same ID, but different meta (eg: dye returns 16 items)
- `void onFillBucket(FillBucketEvent event)`
- `ItemStack onItemRightClick(ItemStack itemstack, World world, EntityPlayer player)` — Called whenever this item is equipped and the right mouse button is pressed.
- `boolean tryPlaceFluid(Block block, World worldIn, BlockPos pos)`

## Fields

- `int capacity`
- `ItemStack empty`
- `boolean nbtSensitive`