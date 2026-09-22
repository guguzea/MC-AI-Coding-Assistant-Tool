# ModelLoader.White

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.texture.TextureAtlasSprite → net.minecraftforge.client.model.ModelLoader.White

## Class signature

```java
public static class ModelLoader.White extends TextureAtlasSprite
```

## Constructors

- `White()`

## Methods

- `boolean hasCustomLoader(IResourceManager manager, ResourceLocation location)` — The result of this function determines is the below 'load' function is called, and the default vanilla loading code is bypassed completely.
- `boolean load(IResourceManager manager, ResourceLocation location)` — Load the specified resource as this sprite's data.
- `void register(TextureMap map)`

## Fields

- `static ModelLoader.White instance`
- `static ResourceLocation loc`