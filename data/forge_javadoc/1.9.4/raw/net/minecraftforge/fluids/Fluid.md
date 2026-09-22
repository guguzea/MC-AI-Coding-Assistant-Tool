---
title: "Fluid"
description: "public class Fluid extends java.lang.Object"
package: "net/minecraftforge/fluids"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fluids/Fluid.html"
sourceType: javadoc
---

# Fluid

**Inheritance:** java.lang.Object → net.minecraftforge.fluids.Fluid

## Class signature

```java
public class Fluid extends java.lang.Object
```

## Constructors

- `Fluid(java.lang.String fluidName, ResourceLocation still, ResourceLocation flowing)`

## Methods

- `boolean canBePlacedInWorld()`
- `Block getBlock()`
- `int getColor()`
- `int getColor(FluidStack stack)`
- `int getColor(World world, BlockPos pos)`
- `int getDensity()`
- `int getDensity(FluidStack stack)`
- `int getDensity(World world, BlockPos pos)`
- `SoundEvent getEmptySound()`
- `SoundEvent getEmptySound(FluidStack stack)`
- `SoundEvent getEmptySound(World world, BlockPos pos)`
- `SoundEvent getFillSound()`
- `SoundEvent getFillSound(FluidStack stack)`
- `SoundEvent getFillSound(World world, BlockPos pos)`
- `ResourceLocation getFlowing()`
- `ResourceLocation getFlowing(FluidStack stack)`
- `ResourceLocation getFlowing(World world, BlockPos pos)`
- `java.lang.String getLocalizedName(FluidStack stack)` — Returns the localized name of this fluid.
- `int getLuminosity()`
- `int getLuminosity(FluidStack stack)`
- `int getLuminosity(World world, BlockPos pos)`
- `java.lang.String getName()`
- `EnumRarity getRarity()`
- `EnumRarity getRarity(FluidStack stack)`
- `EnumRarity getRarity(World world, BlockPos pos)`
- `ResourceLocation getStill()`
- `ResourceLocation getStill(FluidStack stack)`
- `ResourceLocation getStill(World world, BlockPos pos)`
- `int getTemperature()`
- `int getTemperature(FluidStack stack)`
- `int getTemperature(World world, BlockPos pos)`
- `java.lang.String getUnlocalizedName()` — Returns the unlocalized name of this fluid.
- `java.lang.String getUnlocalizedName(FluidStack stack)` — A FluidStack sensitive version of getUnlocalizedName
- `int getViscosity()`
- `int getViscosity(FluidStack stack)`
- `int getViscosity(World world, BlockPos pos)`
- `boolean isGaseous()`
- `boolean isGaseous(FluidStack stack)`
- `boolean isGaseous(World world, BlockPos pos)`
- `Fluid setBlock(Block block)`
- `Fluid setDensity(int density)`
- `Fluid setEmptySound(SoundEvent emptySound)`
- `Fluid setFillSound(SoundEvent fillSound)`
- `Fluid setGaseous(boolean isGaseous)`
- `Fluid setLuminosity(int luminosity)`
- `Fluid setRarity(EnumRarity rarity)`
- `Fluid setTemperature(int temperature)`
- `Fluid setUnlocalizedName(java.lang.String unlocalizedName)`
- `Fluid setViscosity(int viscosity)`

## Fields

- `protected Block block` — If there is a Block implementation of the Fluid, the Block is linked here.
- `protected int density` — Density of the fluid - completely arbitrary; negative density indicates that the fluid is lighter than air.
- `protected ResourceLocation flowing`
- `protected java.lang.String fluidName` — The unique identification name for this fluid.
- `protected boolean isGaseous` — This indicates if the fluid is gaseous.
- `protected int luminosity` — The light level emitted by this fluid.
- `protected EnumRarity rarity` — The rarity of the fluid.
- `protected ResourceLocation still`
- `protected int temperature` — Temperature of the fluid - completely arbitrary; higher temperature indicates that the fluid is hotter than air.
- `protected java.lang.String unlocalizedName` — The unlocalized name of this fluid.
- `protected int viscosity` — Viscosity ("thickness") of the fluid - completely arbitrary; negative values are not permissible.
