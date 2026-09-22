# BlockStateMapper

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.block.statemap.BlockStateMapper

## Class signature

```java
public class BlockStateMapper extends java.lang.Object
```

## Constructors

- `BlockStateMapper()`

## Methods

- `java.util.Set<ResourceLocation> getBlockstateLocations(Block blockIn)`
- `java.util.Map<IBlockState, ModelResourceLocation> getVariants(Block blockIn)`
- `java.util.Map<IBlockState, ModelResourceLocation> putAllStateModelLocations()`
- `void registerBlockStateMapper(Block blockIn, IStateMapper stateMapper)`
- `void registerBuiltInBlocks(Block ... blockIn)`