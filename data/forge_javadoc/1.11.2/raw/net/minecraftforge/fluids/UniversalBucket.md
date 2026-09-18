---
title: "UniversalBucket"
description: "A universal bucket that can hold any liquid"
package: "net/minecraftforge/fluids"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fluids/UniversalBucket.html"
sourceType: javadoc
---

# UniversalBucket

## Class signature

```java
public class UniversalBucket extends Item
```

## Constructors

- `public UniversalBucket()`
- `public UniversalBucket(int capacity, @Nonnull ItemStack empty, boolean nbtSensitive)`

## Methods

- `public boolean hasContainerItem(@Nonnull ItemStack stack)`
- `@Nonnull public ItemStack getContainerItem(@Nonnull ItemStack itemStack)`
- `public void getSubItems(@Nonnull Item itemIn, @Nullable CreativeTabs tab, @Nonnull NonNullList < ItemStack > subItems)`
- `@Nonnull public java.lang.String getItemStackDisplayName(@Nonnull ItemStack stack)`
- `@Nonnull public ActionResult < ItemStack > onItemRightClick(@Nonnull World world, @Nonnull EntityPlayer player, @Nonnull EnumHand hand)`
- `public void onFillBucket( FillBucketEvent event)`
- `@Nonnull public static ItemStack getFilledBucket(@Nonnull UniversalBucket item, Fluid fluid)`
- `@Nullable public FluidStack getFluid(@Nonnull ItemStack container)`
- `public int getCapacity()`
- `@Nonnull public ItemStack getEmpty()`
- `public boolean isNbtSensitive()`
- `public ICapabilityProvider initCapabilities(@Nonnull ItemStack stack, NBTTagCompound nbt)`

## Description

A universal bucket that can hold any liquid
