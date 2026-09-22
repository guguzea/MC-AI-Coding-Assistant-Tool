# ItemTextureQuadConverter

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.ItemTextureQuadConverter

## Class signature

```java
public final class ItemTextureQuadConverter extends java.lang.Object
```

## Methods

- `@Deprecated static java.util.List<UnpackedBakedQuad> convertTexture(VertexFormat format, TRSRTransformation transform, TextureAtlasSprite template, TextureAtlasSprite sprite, float z, EnumFacing facing, int color)` — Deprecated. use convertTexture(VertexFormat, TRSRTransformation, TextureAtlasSprite, TextureAtlasSprite, float, EnumFacing, int, int)
- `static java.util.List<UnpackedBakedQuad> convertTexture(VertexFormat format, TRSRTransformation transform, TextureAtlasSprite template, TextureAtlasSprite sprite, float z, EnumFacing facing, int color, int tint)` — Takes a texture and converts it into BakedQuads.
- `@Deprecated static java.util.List<UnpackedBakedQuad> convertTextureHorizontal(VertexFormat format, TRSRTransformation transform, TextureAtlasSprite template, TextureAtlasSprite sprite, float z, EnumFacing facing, int color)` — Deprecated. use convertTextureHorizontal(VertexFormat, TRSRTransformation, TextureAtlasSprite, TextureAtlasSprite, float, EnumFacing, int, int)
- `static java.util.List<UnpackedBakedQuad> convertTextureHorizontal(VertexFormat format, TRSRTransformation transform, TextureAtlasSprite template, TextureAtlasSprite sprite, float z, EnumFacing facing, int color, int tint)` — Scans a texture and converts it into a list of horizontal strips stacked on top of each other.
- `@Deprecated static java.util.List<UnpackedBakedQuad> convertTextureVertical(VertexFormat format, TRSRTransformation transform, TextureAtlasSprite template, TextureAtlasSprite sprite, float z, EnumFacing facing, int color)` — Deprecated. use convertTextureVertical(VertexFormat, TRSRTransformation, TextureAtlasSprite, TextureAtlasSprite, float, EnumFacing, int, int)
- `static java.util.List<UnpackedBakedQuad> convertTextureVertical(VertexFormat format, TRSRTransformation transform, TextureAtlasSprite template, TextureAtlasSprite sprite, float z, EnumFacing facing, int color, int tint)` — Scans a texture and converts it into a list of vertical strips stacked next to each other from left to right.
- `@Deprecated static UnpackedBakedQuad genQuad(VertexFormat format, TRSRTransformation transform, float x1, float y1, float x2, float y2, float z, TextureAtlasSprite sprite, EnumFacing facing, int color)` — Deprecated. use genQuad(VertexFormat, TRSRTransformation, float, float, float, float, float, TextureAtlasSprite, EnumFacing, int, int)
- `static UnpackedBakedQuad genQuad(VertexFormat format, TRSRTransformation transform, float x1, float y1, float x2, float y2, float z, TextureAtlasSprite sprite, EnumFacing facing, int color, int tint)` — Generates a Front/Back quad for an itemmodel.