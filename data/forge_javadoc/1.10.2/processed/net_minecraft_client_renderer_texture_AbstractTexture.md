# AbstractTexture

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.texture.AbstractTexture

## Class signature

```java
public abstract class AbstractTexture extends java.lang.Object implements ITextureObject
```

## Constructors

- `AbstractTexture()`

## Methods

- `void deleteGlTexture()`
- `int getGlTextureId()`
- `void restoreLastBlurMipmap()`
- `void setBlurMipmap(boolean blurIn, boolean mipmapIn)`
- `void setBlurMipmapDirect(boolean blurIn, boolean mipmapIn)`

## Fields

- `protected boolean blur`
- `protected boolean blurLast`
- `protected int glTextureId`
- `protected boolean mipmap`
- `protected boolean mipmapLast`