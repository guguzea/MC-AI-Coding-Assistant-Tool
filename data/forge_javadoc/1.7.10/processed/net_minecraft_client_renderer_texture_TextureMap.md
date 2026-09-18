# TextureMap

## Class signature

```java
public class TextureMap extends AbstractTexture implements ITickableTextureObject , IIconRegister
```

## Constructors

- `public TextureMap(int p_i1281_1_, java.lang.String p_i1281_2_)`
- `public TextureMap(int p_i1281_1_, java.lang.String p_i1281_2_, boolean skipFirst)`

## Methods

- `public void loadTexture( IResourceManager p_110551_1_) throws java.io.IOException`
- `public void loadTextureAtlas( IResourceManager p_110571_1_)`
- `public TextureAtlasSprite getAtlasSprite(java.lang.String p_110572_1_)`
- `public void updateAnimations()`
- `public IIcon registerIcon(java.lang.String p_94245_1_)`
- `public int getTextureType()`
- `public void tick()`
- `public void setMipmapLevels(int p_147633_1_)`
- `public void setAnisotropicFiltering(int p_147632_1_)`