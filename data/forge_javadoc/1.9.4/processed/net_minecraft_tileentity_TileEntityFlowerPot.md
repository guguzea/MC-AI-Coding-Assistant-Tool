# TileEntityFlowerPot

## Class signature

```java
public class TileEntityFlowerPot extends TileEntity
```

## Constructors

- `public TileEntityFlowerPot()`
- `public TileEntityFlowerPot( Item potItem, int potData)`

## Methods

- `public NBTTagCompound writeToNBT( NBTTagCompound compound)`
- `public void readFromNBT( NBTTagCompound compound)`
- `@Nullable public SPacketUpdateTileEntity getUpdatePacket()`
- `public NBTTagCompound getUpdateTag()`
- `public void setFlowerPotData( Item potItem, int potData)`
- `@Nullable public ItemStack getFlowerItemStack()`
- `@Nullable public Item getFlowerPotItem()`
- `public int getFlowerPotData()`