# BlockState

## Class signature

```java
public class BlockState extends java.lang.Object
```

## Constructors

- `public BlockState( Block blockIn, IProperty ... properties)`
- `protected BlockState( Block blockIn, IProperty [] properties, <any> unlistedProperties)`

## Methods

- `protected BlockState.StateImplementation createState( Block block, <any> properties, <any> unlistedProperties)`
- `public <any> getValidStates()`
- `public IBlockState getBaseState()`
- `public Block getBlock()`
- `public java.util.Collection< IProperty > getProperties()`
- `public java.lang.String toString()`