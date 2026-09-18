# RenderGuardian

## Class signature

```java
public class RenderGuardian extends RenderLiving < EntityGuardian >
```

## Constructors

- `public RenderGuardian( RenderManager renderManagerIn)`

## Methods

- `public boolean shouldRender( EntityGuardian livingEntity, ICamera camera, double camX, double camY, double camZ)`
- `public void doRender( EntityGuardian entity, double x, double y, double z, float entityYaw, float partialTicks)`
- `protected ResourceLocation getEntityTexture( EntityGuardian entity)`