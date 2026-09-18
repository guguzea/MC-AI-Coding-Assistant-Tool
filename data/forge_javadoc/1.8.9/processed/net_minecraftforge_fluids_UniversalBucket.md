# UniversalBucket

## Class signature

```java
public class UniversalBucket extends Item implements IFluidContainerItem
```

## Constructors

- `public UniversalBucket()`
- `public UniversalBucket(int capacity, ItemStack empty, boolean nbtSensitive)`

## Methods

- `public void getSubItems( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > subItems)`
- `public java.lang.String getItemStackDisplayName( ItemStack stack)`
- `public ItemStack onItemRightClick( ItemStack itemstack, World world, EntityPlayer player)`
- `public boolean tryPlaceFluid( Block block, World worldIn, BlockPos pos)`
- `public void onFillBucket( FillBucketEvent event)`
- `public static ItemStack getFilledBucket( UniversalBucket item, Fluid fluid)`
- `public FluidStack getFluid( ItemStack container)`
- `public int getCapacity( ItemStack container)`
- `public int fill( ItemStack container, FluidStack resource, boolean doFill)`
- `public FluidStack drain( ItemStack container, int maxDrain, boolean doDrain)`

## Description

A universal bucket that can hold any liquid