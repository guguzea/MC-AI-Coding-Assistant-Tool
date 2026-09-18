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
- `public boolean hasCapability( Capability <?> capability, EnumFacing facing)`
- `public <T> T getCapability( Capability <T> capability, EnumFacing facing)`

## Description

Retrieves the handler for the capability requested on the specific side.