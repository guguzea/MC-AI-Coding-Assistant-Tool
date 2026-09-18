# TileEntityBanner

## Class signature

```java
public class TileEntityBanner extends TileEntity implements IWorldNameable
```

## Constructors

- `public TileEntityBanner()`

## Methods

- `public void setItemValues( ItemStack stack, boolean p_175112_2_)`
- `public java.lang.String getName()`
- `public boolean hasCustomName()`
- `public ITextComponent getDisplayName()`
- `public NBTTagCompound writeToNBT( NBTTagCompound compound)`
- `public void readFromNBT( NBTTagCompound compound)`
- `public SPacketUpdateTileEntity getUpdatePacket()`
- `public NBTTagCompound getUpdateTag()`
- `public static int getPatterns( ItemStack stack)`
- `public java.util.List< BannerPattern > getPatternList()`
- `public java.util.List< EnumDyeColor > getColorList()`
- `public java.lang.String getPatternResourceLocation()`
- `public static void removeBannerData( ItemStack stack)`
- `public ItemStack getItem()`
- `public static EnumDyeColor getColor( ItemStack p_190616_0_)`