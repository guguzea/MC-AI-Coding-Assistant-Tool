# RenderMinecart

## Class signature

```java
public class RenderMinecart<T extends EntityMinecart > extends Render <T>
```

## Constructors

- `public RenderMinecart( RenderManager renderManagerIn)`

## Methods

- `public void doRender( T entity, double x, double y, double z, float entityYaw, float partialTicks)`
- `protected ResourceLocation getEntityTexture( T entity)`
- `protected void renderCartContents( T p_188319_1_, float p_188319_2_, IBlockState p_188319_3_)`