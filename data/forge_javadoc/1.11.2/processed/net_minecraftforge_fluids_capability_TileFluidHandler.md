# TileFluidHandler

## Class signature

```java
public class TileFluidHandler extends TileEntity
```

## Constructors

- `public TileFluidHandler()`

## Methods

- `public void readFromNBT( NBTTagCompound tag)`
- `public NBTTagCompound writeToNBT( NBTTagCompound tag)`
- `public boolean hasCapability(@Nonnull Capability <?> capability, @Nullable EnumFacing facing)`
- `@Nullable public <T> T getCapability(@Nonnull Capability <T> capability, @Nullable EnumFacing facing)`

## Description

Retrieves the handler for the capability requested on the specific side.