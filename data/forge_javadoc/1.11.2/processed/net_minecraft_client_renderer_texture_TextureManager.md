# TextureManager

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.texture.TextureManager

## Class signature

```java
public class TextureManager extends java.lang.Object implements ITickable, IResourceManagerReloadListener
```

## Constructors

- `TextureManager(IResourceManager resourceManager)`

## Methods

- `void bindTexture(ResourceLocation resource)`
- `void deleteTexture(ResourceLocation textureLocation)`
- `ResourceLocation getDynamicTextureLocation(java.lang.String name, DynamicTexture texture)`
- `ITextureObject getTexture(ResourceLocation textureLocation)`
- `boolean loadTexture(ResourceLocation textureLocation, ITextureObject textureObj)`
- `boolean loadTickableTexture(ResourceLocation textureLocation, ITickableTextureObject textureObj)`
- `void onResourceManagerReload(IResourceManager resourceManager)`
- `void tick()`