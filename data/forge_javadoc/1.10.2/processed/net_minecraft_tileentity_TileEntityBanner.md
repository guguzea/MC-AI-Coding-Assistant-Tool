# TileEntityBanner

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityBanner

## Class signature

```java
public class TileEntityBanner extends TileEntity
```

## Methods

- `static void addBaseColorTag(ItemStack p_184248_0_, EnumDyeColor p_184248_1_)`
- `int getBaseColor()`
- `static int getBaseColor(ItemStack stack)`
- `java.util.List<EnumDyeColor> getColorList()`
- `java.util.List<TileEntityBanner.EnumBannerPattern> getPatternList()`
- `java.lang.String getPatternResourceLocation()`
- `NBTTagList getPatterns()`
- `static int getPatterns(ItemStack stack)`
- `SPacketUpdateTileEntity getUpdatePacket()`
- `NBTTagCompound getUpdateTag()`
- `void readFromNBT(NBTTagCompound compound)`
- `static void removeBannerData(ItemStack stack)`
- `static void setBaseColorAndPatterns(NBTTagCompound compound, int baseColorIn, NBTTagList patternsIn)`
- `void setItemValues(ItemStack stack)`
- `NBTTagCompound writeToNBT(NBTTagCompound compound)`

## Fields

- `TileEntityBanner`