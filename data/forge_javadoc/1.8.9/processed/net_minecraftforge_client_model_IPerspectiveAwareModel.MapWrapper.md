# IPerspectiveAwareModel.MapWrapper

## Constructors

- `public MapWrapper( IFlexibleBakedModel parent, <any> transforms)`

## Methods

- `public static <any> getTransforms( IModelState state)`
- `public static <any> getTransforms( ItemCameraTransforms transforms)`
- `public static <any> handlePerspective( IFlexibleBakedModel model, <any> transforms, ItemCameraTransforms.TransformType cameraTransformType)`
- `public static <any> handlePerspective( IFlexibleBakedModel model, IModelState state, ItemCameraTransforms.TransformType cameraTransformType)`
- `public boolean isAmbientOcclusion()`
- `public boolean isGui3d()`
- `public boolean isBuiltInRenderer()`
- `public TextureAtlasSprite getParticleTexture()`
- `public ItemCameraTransforms getItemCameraTransforms()`
- `public java.util.List< BakedQuad > getFaceQuads( EnumFacing side)`
- `public java.util.List< BakedQuad > getGeneralQuads()`
- `public VertexFormat getFormat()`
- `public <any> handlePerspective( ItemCameraTransforms.TransformType cameraTransformType)`