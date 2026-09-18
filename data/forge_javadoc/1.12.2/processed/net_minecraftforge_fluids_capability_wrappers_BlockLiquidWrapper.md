# BlockLiquidWrapper

## Class signature

```java
public class BlockLiquidWrapper extends java.lang.Object implements IFluidHandler
```

## Constructors

- `public BlockLiquidWrapper( BlockLiquid blockLiquid, World world, BlockPos blockPos)`

## Methods

- `public IFluidTankProperties [] getTankProperties()`
- `public int fill( FluidStack resource, boolean doFill)`
- `public FluidStack drain( FluidStack resource, boolean doDrain)`
- `public FluidStack drain(int maxDrain, boolean doDrain)`

## Description

Wrapper to handle vanilla Water or Lava as an IFluidHandler. Methods are modeled after ItemBucket.onItemRightClick(World, EntityPlayer, EnumHand)