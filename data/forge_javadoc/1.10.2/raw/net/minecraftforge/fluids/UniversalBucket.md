---
title: "UniversalBucket"
description: "A universal bucket that can hold any liquid"
package: "net/minecraftforge/fluids"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fluids/UniversalBucket.html"
sourceType: javadoc
---

# UniversalBucket

## Class signature

```java
public class UniversalBucket extends Item implements IFluidContainerItem
```

## Constructors

- `public UniversalBucket()`
- `public UniversalBucket(int capacity, ItemStack empty, boolean nbtSensitive)`

## Methods

- `public boolean hasContainerItem( ItemStack stack)`
- `public ItemStack getContainerItem( ItemStack itemStack)`
- `public void getSubItems( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > subItems)`
- `public java.lang.String getItemStackDisplayName( ItemStack stack)`
- `public ActionResult < ItemStack > onItemRightClick( ItemStack itemstack, World world, EntityPlayer player, EnumHand hand)`
- `@Deprecated public boolean tryPlaceFluid( Block block, World worldIn, BlockPos pos)`
- `public void onFillBucket( FillBucketEvent event)`
- `public static ItemStack getFilledBucket( UniversalBucket item, Fluid fluid)`
- `public FluidStack getFluid( ItemStack container)`
- `public int getCapacity( ItemStack container)`
- `public int fill( ItemStack container, FluidStack resource, boolean doFill)`
- `public FluidStack drain( ItemStack container, int maxDrain, boolean doDrain)`
- `public int getCapacity()`
- `public ItemStack getEmpty()`
- `public boolean isNbtSensitive()`
- `public ICapabilityProvider initCapabilities( ItemStack stack, NBTTagCompound nbt)`

## Description

A universal bucket that can hold any liquid
