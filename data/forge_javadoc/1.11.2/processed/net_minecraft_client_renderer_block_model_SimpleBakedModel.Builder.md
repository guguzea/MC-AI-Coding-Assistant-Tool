# SimpleBakedModel.Builder

## Constructors

- `public Builder( ModelBlock model, ItemOverrideList overrides)`
- `public Builder( IBlockState state, IBakedModel model, TextureAtlasSprite texture, BlockPos pos)`

## Methods

- `public SimpleBakedModel.Builder addFaceQuad( EnumFacing facing, BakedQuad quad)`
- `public SimpleBakedModel.Builder addGeneralQuad( BakedQuad quad)`
- `public SimpleBakedModel.Builder setTexture( TextureAtlasSprite texture)`
- `public IBakedModel makeBakedModel()`