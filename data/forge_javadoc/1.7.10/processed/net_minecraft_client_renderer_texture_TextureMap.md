# TextureMap

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.texture.AbstractTexture → net.minecraft.client.renderer.texture.TextureMap

## Class signature

```java
public class TextureMap extends AbstractTexture implements ITickableTextureObject, IIconRegister
```

## Constructors

- `TextureMap(int p_i1281_1_, java.lang.String p_i1281_2_)`
- `TextureMap(int p_i1281_1_, java.lang.String p_i1281_2_, boolean skipFirst)`

## Methods

- `TextureAtlasSprite getAtlasSprite(java.lang.String p_110572_1_)`
- `int getTextureType()`
- `void loadTexture(IResourceManager p_110551_1_)`
- `void loadTextureAtlas(IResourceManager p_110571_1_)`
- `IIcon registerIcon(java.lang.String p_94245_1_)`
- `void setAnisotropicFiltering(int p_147632_1_)`
- `void setMipmapLevels(int p_147633_1_)`
- `void tick()`
- `void updateAnimations()`

## Fields

- `static ResourceLocation locationBlocksTexture`
- `static ResourceLocation locationItemsTexture`