# TileEntityEnderChest

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityEnderChest

## Class signature

```java
public class TileEntityEnderChest extends TileEntity implements ITickable
```

## Constructors

- `TileEntityEnderChest()`

## Methods

- `boolean canBeUsed(EntityPlayer p_145971_1_)`
- `void closeChest()`
- `void invalidate()` — invalidates a tile entity
- `void openChest()`
- `boolean receiveClientEvent(int id, int type)`
- `void update()` — Like the old updateEntity(), except more generic.

## Fields

- `float lidAngle`
- `int numPlayersUsing`
- `float prevLidAngle` — The angle of the ender chest lid last tick