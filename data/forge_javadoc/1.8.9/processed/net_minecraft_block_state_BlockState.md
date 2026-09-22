# BlockState

**Inheritance:** java.lang.Object → net.minecraft.block.state.BlockState

## Class signature

```java
public class BlockState extends java.lang.Object
```

## Constructors

- `BlockState(Block blockIn, IProperty ... properties)`
- `BlockState(Block blockIn, IProperty [] properties, <any> unlistedProperties)`

## Methods

- `protected BlockState.StateImplementation createState(Block block, <any> properties, <any> unlistedProperties)`
- `IBlockState getBaseState()`
- `Block getBlock()`
- `java.util.Collection<IProperty> getProperties()`
- `<any> getValidStates()`
- `java.lang.String toString()`