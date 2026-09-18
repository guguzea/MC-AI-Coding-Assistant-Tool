# TextureManager

## Class signature

```java
public class TextureManager extends java.lang.Object implements ITickable , IResourceManagerReloadListener
```

## Constructors

- `public TextureManager( IResourceManager resourceManager)`

## Methods

- `public void bindTexture( ResourceLocation resource)`
- `public boolean loadTickableTexture( ResourceLocation textureLocation, ITickableTextureObject textureObj)`
- `public boolean loadTexture( ResourceLocation textureLocation, ITextureObject textureObj)`
- `public ITextureObject getTexture( ResourceLocation textureLocation)`
- `public ResourceLocation getDynamicTextureLocation(java.lang.String name, DynamicTexture texture)`
- `public void tick()`
- `public void deleteTexture( ResourceLocation textureLocation)`
- `public void onResourceManagerReload( IResourceManager resourceManager)`