# Fluid

## Class signature

```java
public class Fluid extends java.lang.Object
```

## Constructors

- `public Fluid(java.lang.String fluidName, ResourceLocation still, ResourceLocation flowing)`

## Methods

- `public Fluid setUnlocalizedName(java.lang.String unlocalizedName)`
- `public Fluid setBlock( Block block)`
- `public Fluid setLuminosity(int luminosity)`
- `public Fluid setDensity(int density)`
- `public Fluid setTemperature(int temperature)`
- `public Fluid setViscosity(int viscosity)`
- `public Fluid setGaseous(boolean isGaseous)`
- `public Fluid setRarity( EnumRarity rarity)`
- `public Fluid setFillSound( SoundEvent fillSound)`
- `public Fluid setEmptySound( SoundEvent emptySound)`
- `public final java.lang.String getName()`
- `public final Block getBlock()`
- `public final boolean canBePlacedInWorld()`
- `public java.lang.String getLocalizedName( FluidStack stack)`
- `public java.lang.String getUnlocalizedName( FluidStack stack)`
- `public java.lang.String getUnlocalizedName()`
- `public final int getLuminosity()`
- `public final int getDensity()`
- `public final int getTemperature()`
- `public final int getViscosity()`
- `public final boolean isGaseous()`
- `public EnumRarity getRarity()`
- `public int getColor()`
- `public ResourceLocation getStill()`
- `public ResourceLocation getFlowing()`
- `public SoundEvent getFillSound()`
- `public SoundEvent getEmptySound()`
- `public int getLuminosity( FluidStack stack)`
- `public int getDensity( FluidStack stack)`
- `public int getTemperature( FluidStack stack)`
- `public int getViscosity( FluidStack stack)`
- `public boolean isGaseous( FluidStack stack)`
- `public EnumRarity getRarity( FluidStack stack)`
- `public int getColor( FluidStack stack)`
- `public ResourceLocation getStill( FluidStack stack)`
- `public ResourceLocation getFlowing( FluidStack stack)`
- `public SoundEvent getFillSound( FluidStack stack)`
- `public SoundEvent getEmptySound( FluidStack stack)`
- `public int getLuminosity( World world, BlockPos pos)`
- `public int getDensity( World world, BlockPos pos)`
- `public int getTemperature( World world, BlockPos pos)`
- `public int getViscosity( World world, BlockPos pos)`
- `public boolean isGaseous( World world, BlockPos pos)`
- `public EnumRarity getRarity( World world, BlockPos pos)`
- `public int getColor( World world, BlockPos pos)`
- `public ResourceLocation getStill( World world, BlockPos pos)`
- `public ResourceLocation getFlowing( World world, BlockPos pos)`
- `public SoundEvent getFillSound( World world, BlockPos pos)`
- `public SoundEvent getEmptySound( World world, BlockPos pos)`

## Description

Minecraft Forge Fluid Implementation This class is a fluid (liquid or gas) equivalent to "Item." It describes the nature of a fluid and contains its general properties. These properties do not have in