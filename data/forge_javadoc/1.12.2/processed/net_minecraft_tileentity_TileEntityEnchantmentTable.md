# TileEntityEnchantmentTable

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityEnchantmentTable

## Class signature

```java
public class TileEntityEnchantmentTable extends TileEntity implements ITickable, IInteractionObject
```

## Constructors

- `TileEntityEnchantmentTable()`

## Methods

- `Container createContainer(InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `ITextComponent getDisplayName()`
- `java.lang.String getGuiID()`
- `java.lang.String getName()`
- `boolean hasCustomName()`
- `void readFromNBT(NBTTagCompound compound)`
- `void setCustomName(java.lang.String customNameIn)`
- `void update()`
- `NBTTagCompound writeToNBT(NBTTagCompound compound)`

## Fields

- `float bookRotation`
- `float bookRotationPrev`
- `float bookSpread`
- `float bookSpreadPrev`
- `float flipA`
- `float flipT`
- `float pageFlip`
- `float pageFlipPrev`
- `int tickCount`
- `float tRot`