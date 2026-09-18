---
title: "UniversalBucket"
description: "A universal bucket that can hold any liquid"
package: "net/minecraftforge/fluids"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fluids/UniversalBucket.html"
sourceType: javadoc
---

# UniversalBucket

## Class signature

```java
public class UniversalBucket extends Item
```

## Constructors

- `public UniversalBucket()`
- `public UniversalBucket(int capacity, ItemStack empty, boolean nbtSensitive)`

## Methods

- `public boolean hasContainerItem( ItemStack stack)`
- `public ItemStack getContainerItem( ItemStack itemStack)`
- `public void getSubItems( CreativeTabs tab, NonNullList < ItemStack > subItems)`
- `public java.lang.String getItemStackDisplayName( ItemStack stack)`
- `public ActionResult < ItemStack > onItemRightClick( World world, EntityPlayer player, EnumHand hand)`
- `public void onFillBucket( FillBucketEvent event)`
- `@Deprecated public static ItemStack getFilledBucket( UniversalBucket item, Fluid fluid)`
- `public FluidStack getFluid( ItemStack container)`
- `public int getCapacity()`
- `public ItemStack getEmpty()`
- `public boolean isNbtSensitive()`
- `public java.lang.String getCreatorModId( ItemStack itemStack)`
- `public ICapabilityProvider initCapabilities( ItemStack stack, NBTTagCompound nbt)`

## Description

A universal bucket that can hold any liquid
