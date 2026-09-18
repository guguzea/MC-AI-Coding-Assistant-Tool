# Render

## Class signature

```java
public abstract class Render extends java.lang.Object
```

## Constructors

- `public Render()`

## Methods

- `public abstract void doRender( Entity p_76986_1_, double p_76986_2_, double p_76986_4_, double p_76986_6_, float p_76986_8_, float p_76986_9_)`
- `protected abstract ResourceLocation getEntityTexture( Entity p_110775_1_)`
- `public boolean isStaticEntity()`
- `protected void bindEntityTexture( Entity p_110777_1_)`
- `protected void bindTexture( ResourceLocation p_110776_1_)`
- `public static void renderOffsetAABB( AxisAlignedBB p_76978_0_, double p_76978_1_, double p_76978_3_, double p_76978_5_)`
- `public static void renderAABB( AxisAlignedBB p_76980_0_)`
- `public void setRenderManager( RenderManager p_76976_1_)`
- `public void doRenderShadowAndFire( Entity p_76979_1_, double p_76979_2_, double p_76979_4_, double p_76979_6_, float p_76979_8_, float p_76979_9_)`
- `public FontRenderer getFontRendererFromRenderManager()`
- `public void updateIcons( IIconRegister p_94143_1_)`
- `protected void func_147906_a( Entity p_147906_1_, java.lang.String p_147906_2_, double p_147906_3_, double p_147906_5_, double p_147906_7_, int p_147906_9_)`