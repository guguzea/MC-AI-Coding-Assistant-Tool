# TextureManager

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.texture.TextureManager

## Class signature

```java
public class TextureManager extends java.lang.Object implements ITickable, IResourceManagerReloadListener
```

## Constructors

- `TextureManager(IResourceManager p_i1284_1_)`

## Methods

- `void bindTexture(ResourceLocation p_110577_1_)`
- `void deleteTexture(ResourceLocation p_147645_1_)`
- `ResourceLocation getDynamicTextureLocation(java.lang.String p_110578_1_, DynamicTexture p_110578_2_)`
- `ResourceLocation getResourceLocation(int p_130087_1_)`
- `ITextureObject getTexture(ResourceLocation p_110581_1_)`
- `boolean loadTexture(ResourceLocation p_110579_1_, ITextureObject p_110579_2_)`
- `boolean loadTextureMap(ResourceLocation p_130088_1_, TextureMap p_130088_2_)`
- `boolean loadTickableTexture(ResourceLocation p_110580_1_, ITickableTextureObject p_110580_2_)`
- `void onResourceManagerReload(IResourceManager p_110549_1_)`
- `void tick()`