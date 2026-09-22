# EntityViewRenderEvent.CameraSetup

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.client.event.EntityViewRenderEvent → net.minecraftforge.client.event.EntityViewRenderEvent.CameraSetup

## Class signature

```java
public static class EntityViewRenderEvent.CameraSetup extends EntityViewRenderEvent
```

## Constructors

- `CameraSetup(EntityRenderer renderer, Entity entity, IBlockState state, double renderPartialTicks, float yaw, float pitch, float roll)`

## Methods

- `float getPitch()`
- `float getRoll()`
- `float getYaw()`
- `void setPitch(float pitch)`
- `void setRoll(float roll)`
- `void setYaw(float yaw)`