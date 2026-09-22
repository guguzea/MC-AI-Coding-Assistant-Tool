# SimpleBakedModel.Builder

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.block.model.SimpleBakedModel.Builder

## Class signature

```java
public static class SimpleBakedModel.Builder extends java.lang.Object
```

## Constructors

- `Builder(IBlockState state, IBakedModel model, TextureAtlasSprite texture, BlockPos pos)`
- `Builder(ModelBlock model, ItemOverrideList overrides)`

## Methods

- `SimpleBakedModel.Builder addFaceQuad(EnumFacing facing, BakedQuad quad)`
- `SimpleBakedModel.Builder addGeneralQuad(BakedQuad quad)`
- `IBakedModel makeBakedModel()`
- `SimpleBakedModel.Builder setTexture(TextureAtlasSprite texture)`