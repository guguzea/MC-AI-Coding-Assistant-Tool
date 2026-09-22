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
- `IChatComponent getDisplayName()` — Get the formatted ChatComponent that will be used for the sender's username in chat
- `java.lang.String getGuiID()`
- `java.lang.String getName()` — Get the name of this object.
- `boolean hasCustomName()` — Returns true if this thing is named
- `void readFromNBT(NBTTagCompound compound)`
- `void setCustomName(java.lang.String customNameIn)`
- `void update()` — Like the old updateEntity(), except more generic.
- `void writeToNBT(NBTTagCompound compound)`

## Fields

- `float bookRotation`
- `float bookRotationPrev`
- `float bookSpread`
- `float bookSpreadPrev`
- `float field_145924_q`
- `float field_145929_l`
- `float field_145932_k`
- `float pageFlip`
- `float pageFlipPrev`
- `int tickCount`