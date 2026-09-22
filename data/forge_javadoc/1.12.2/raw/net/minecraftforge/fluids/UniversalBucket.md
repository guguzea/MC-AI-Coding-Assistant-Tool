---
title: "UniversalBucket"
description: "public class UniversalBucket extends Item"
package: "net/minecraftforge/fluids"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fluids/UniversalBucket.html"
sourceType: javadoc
---

# UniversalBucket

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Item> → net.minecraft.item.Item → net.minecraftforge.fluids.UniversalBucket

## Class signature

```java
public class UniversalBucket extends Item
```

## Methods

- `int getCapacity()`
- `ItemStack getContainerItem(ItemStack itemStack)` — ItemStack sensitive version of getContainerItem.
- `java.lang.String getCreatorModId(ItemStack itemStack)` — Called to get the Mod ID of the mod that *created* the ItemStack, instead of the real Mod ID that *registered* it.
- `ItemStack getEmpty()`
- `@Deprecated static ItemStack getFilledBucket(UniversalBucket item, Fluid fluid)` — Deprecated. use the NBT-sensitive version FluidUtil.getFilledBucket(FluidStack)
- `FluidStack getFluid(ItemStack container)`
- `java.lang.String getItemStackDisplayName(ItemStack stack)`
- `void getSubItems(CreativeTabs tab, NonNullList<ItemStack> subItems)`
- `boolean hasContainerItem(ItemStack stack)` — ItemStack sensitive version of hasContainerItem
- `ICapabilityProvider initCapabilities(ItemStack stack, NBTTagCompound nbt)` — Called from ItemStack.setItem, will hold extra data for the life of this ItemStack.
- `boolean isNbtSensitive()`
- `void onFillBucket(FillBucketEvent event)`
- `ActionResult<ItemStack> onItemRightClick(World world, EntityPlayer player, EnumHand hand)`

## Fields

- `UniversalBucket`
- `UniversalBucket`
