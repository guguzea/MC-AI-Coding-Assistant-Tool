# SimpleModelFontRenderer

## Class signature

```java
public abstract class SimpleModelFontRenderer extends FontRenderer
```

## Constructors

- `public SimpleModelFontRenderer( GameSettings settings, ResourceLocation font, TextureManager manager, boolean isUnicode, javax.vecmath.Matrix4f matrix, VertexFormat format)`

## Methods

- `public void setSprite( TextureAtlasSprite sprite)`
- `public void setFillBlanks(boolean fillBlanks)`
- `protected float renderDefaultChar(int pos, boolean italic)`
- `public void onResourceManagerReload( IResourceManager resourceManager)`
- `protected abstract float renderUnicodeChar(char c, boolean italic)`
- `protected void doDraw(float shift)`
- `protected void setColor(float r, float g, float b, float a)`
- `public void enableAlpha()`
- `public com.google.common.collect.ImmutableList< BakedQuad > build()`