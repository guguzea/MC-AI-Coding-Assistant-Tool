# BlockStateMapper

## Class signature

```java
public class BlockStateMapper extends java.lang.Object
```

## Constructors

- `public BlockStateMapper()`

## Methods

- `public void registerBlockStateMapper( Block blockIn, IStateMapper stateMapper)`
- `public void registerBuiltInBlocks( Block ... blockIn)`
- `public java.util.Map< IBlockState , ModelResourceLocation > putAllStateModelLocations()`
- `public java.util.Set< ResourceLocation > getBlockstateLocations( Block blockIn)`
- `public java.util.Map< IBlockState , ModelResourceLocation > getVariants( Block blockIn)`