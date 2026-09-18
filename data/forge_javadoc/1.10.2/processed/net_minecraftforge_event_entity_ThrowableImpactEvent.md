# ThrowableImpactEvent

## Class signature

```java
public class ThrowableImpactEvent extends EntityEvent
```

## Constructors

- `public ThrowableImpactEvent( EntityThrowable throwable, RayTraceResult ray)`

## Methods

- `public EntityThrowable getEntityThrowable()`
- `public RayTraceResult getRayTraceResult()`

## Description

This event is fired before an EntityThrowable calls its EntityThrowable.onImpact(net.minecraft.util.math.RayTraceResult) method. This event is fired via ForgeHooks.onThrowableImpact(net.minecraft.enti