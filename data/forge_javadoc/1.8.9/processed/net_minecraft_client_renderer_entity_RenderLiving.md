# RenderLiving

## Class signature

```java
public abstract class RenderLiving<T extends EntityLiving > extends RendererLivingEntity <T>
```

## Constructors

- `public RenderLiving( RenderManager rendermanagerIn, ModelBase modelbaseIn, float shadowsizeIn)`

## Methods

- `protected boolean canRenderName( T entity)`
- `public boolean shouldRender( T livingEntity, ICamera camera, double camX, double camY, double camZ)`
- `public void doRender( T entity, double x, double y, double z, float entityYaw, float partialTicks)`
- `public void func_177105_a( T entityLivingIn, float partialTicks)`
- `protected void renderLeash( T entityLivingIn, double x, double y, double z, float entityYaw, float partialTicks)`

## Description

Actually renders the given argument.