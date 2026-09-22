# OBJModel

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.obj.OBJModel

## Class signature

```java
public class OBJModel extends java.lang.Object implements IRetexturableModel<OBJModel>, IModelCustomData<OBJModel>
```

## Constructors

- `OBJModel(OBJModel.MaterialLibrary matLib, ResourceLocation modelLocation)`
- `OBJModel(OBJModel.MaterialLibrary matLib, ResourceLocation modelLocation, net.minecraftforge.client.model.obj.OBJModel.CustomData customData)`

## Methods

- `IFlexibleBakedModel bake(IModelState state, VertexFormat format, <any> bakedTextureGetter)`
- `IModelState getDefaultState()`
- `java.util.Collection<ResourceLocation> getDependencies()`
- `OBJModel.MaterialLibrary getMatLib()`
- `java.util.Collection<ResourceLocation> getTextures()`
- `IModel process(<any> customData)` — Allows the model to process custom data from the variant definition.
- `IModel retexture(<any> textures)` — Applies new textures to the model.