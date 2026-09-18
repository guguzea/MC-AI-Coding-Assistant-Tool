# TileEntityBanner

## Class signature

```java
public class TileEntityBanner extends TileEntity
```

## Constructors

- `public TileEntityBanner()`

## Methods

- `public void setItemValues( ItemStack stack)`
- `public void writeToNBT( NBTTagCompound compound)`
- `public static void func_181020_a( NBTTagCompound p_181020_0_, int p_181020_1_, NBTTagList p_181020_2_)`
- `public void readFromNBT( NBTTagCompound compound)`
- `public Packet getDescriptionPacket()`
- `public int getBaseColor()`
- `public static int getBaseColor( ItemStack stack)`
- `public static int getPatterns( ItemStack stack)`
- `public java.util.List< TileEntityBanner.EnumBannerPattern > getPatternList()`
- `public NBTTagList func_181021_d()`
- `public java.util.List< EnumDyeColor > getColorList()`
- `public static void removeBannerData( ItemStack stack)`
- `public java.lang.String func_175116_e()`

## Description

Allows for a specialized description packet to be created.