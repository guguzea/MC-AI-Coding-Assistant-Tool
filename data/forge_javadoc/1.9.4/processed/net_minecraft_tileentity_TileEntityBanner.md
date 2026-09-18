# TileEntityBanner

## Class signature

```java
public class TileEntityBanner extends TileEntity
```

## Constructors

- `public TileEntityBanner()`

## Methods

- `public void setItemValues( ItemStack stack)`
- `public NBTTagCompound writeToNBT( NBTTagCompound compound)`
- `public static void setBaseColorAndPatterns( NBTTagCompound compound, int baseColorIn, @Nullable NBTTagList patternsIn)`
- `public void readFromNBT( NBTTagCompound compound)`
- `@Nullable public SPacketUpdateTileEntity getUpdatePacket()`
- `public NBTTagCompound getUpdateTag()`
- `public int getBaseColor()`
- `public static int getBaseColor( ItemStack stack)`
- `public static int getPatterns( ItemStack stack)`
- `public java.util.List< TileEntityBanner.EnumBannerPattern > getPatternList()`
- `public NBTTagList getPatterns()`
- `public java.util.List< EnumDyeColor > getColorList()`
- `public java.lang.String getPatternResourceLocation()`
- `public static void addBaseColorTag( ItemStack p_184248_0_, EnumDyeColor p_184248_1_)`
- `public static void removeBannerData( ItemStack stack)`