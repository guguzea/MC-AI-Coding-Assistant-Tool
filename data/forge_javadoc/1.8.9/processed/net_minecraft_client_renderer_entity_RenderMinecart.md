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
- `protected void func_180560_a( T minecart, float partialTicks, IBlockState state)`

## Description

instance of ModelMinecart for rendering