# RenderLiving

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.entity.Render<T> → net.minecraft.client.renderer.entity.RenderLivingBase<T> → net.minecraft.client.renderer.entity.RenderLiving<T>

## Class signature

```java
public abstract class RenderLiving<T extends EntityLiving> extends RenderLivingBase<T>
```

## Methods

- `protected boolean canRenderName(T entity)`
- `void doRender(T entity, double x, double y, double z, float entityYaw, float partialTicks)`
- `protected void renderLeash(T entityLivingIn, double x, double y, double z, float entityYaw, float partialTicks)`
- `void setLightmap(T entityLivingIn)`
- `boolean shouldRender(T livingEntity, ICamera camera, double camX, double camY, double camZ)`

## Fields

- `RenderLiving`