# TileEntityLockable

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityLockable

## Class signature

```java
public abstract class TileEntityLockable extends TileEntity implements IInteractionObject, ILockableContainer
```

## Methods

- `protected IItemHandler createUnSidedHandler()`
- `<T> T getCapability(Capability<T> capability, EnumFacing facing)` — Retrieves the handler for the capability requested on the specific side.
- `ITextComponent getDisplayName()`
- `LockCode getLockCode()`
- `boolean hasCapability(Capability<?> capability, EnumFacing facing)` — Determines if this object has support for the capability in question on the specific side.
- `boolean isLocked()`
- `void readFromNBT(NBTTagCompound compound)`
- `void setLockCode(LockCode code)`
- `NBTTagCompound writeToNBT(NBTTagCompound compound)`

## Fields

- `TileEntityLockable`