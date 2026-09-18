# BlockWrapper

## Class signature

```java
public class BlockWrapper extends VoidFluidHandler
```

## Constructors

- `public BlockWrapper( Block block, World world, BlockPos blockPos)`

## Methods

- `public int fill( FluidStack resource, boolean doFill)`

## Description

Wrapper around any block, only accounts for fluid placement, otherwise the block acts a void. If the block in question inherits from the default Vanilla or Forge implementations, consider using BlockL