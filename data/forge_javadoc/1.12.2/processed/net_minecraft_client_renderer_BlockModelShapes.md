# BlockModelShapes

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.BlockModelShapes

## Class signature

```java
public class BlockModelShapes extends java.lang.Object
```

## Constructors

- `BlockModelShapes(ModelManager manager)`

## Methods

- `BlockStateMapper getBlockStateMapper()`
- `IBakedModel getModelForState(IBlockState state)`
- `ModelManager getModelManager()`
- `TextureAtlasSprite getTexture(IBlockState state)`
- `void registerBlockWithStateMapper(Block assoc, IStateMapper stateMapper)`
- `void registerBuiltInBlocks(Block ... builtIns)`
- `void reloadModels()`