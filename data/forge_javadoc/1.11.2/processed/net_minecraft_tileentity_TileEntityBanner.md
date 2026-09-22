# TileEntityBanner

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityBanner

## Class signature

```java
public class TileEntityBanner extends TileEntity implements IWorldNameable
```

## Methods

- `static EnumDyeColor getColor(ItemStack p_190616_0_)`
- `java.util.List<EnumDyeColor> getColorList()`
- `ITextComponent getDisplayName()`
- `ItemStack getItem()`
- `java.lang.String getName()`
- `java.util.List<BannerPattern> getPatternList()`
- `java.lang.String getPatternResourceLocation()`
- `static int getPatterns(ItemStack stack)`
- `SPacketUpdateTileEntity getUpdatePacket()`
- `NBTTagCompound getUpdateTag()`
- `boolean hasCustomName()`
- `void readFromNBT(NBTTagCompound compound)`
- `static void removeBannerData(ItemStack stack)`
- `void setItemValues(ItemStack stack, boolean p_175112_2_)`
- `NBTTagCompound writeToNBT(NBTTagCompound compound)`

## Fields

- `TileEntityBanner`