# ProjectileImpactEvent

## Class signature

```java
public class ProjectileImpactEvent extends EntityEvent
```

## Constructors

- `public ProjectileImpactEvent( Entity entity, RayTraceResult ray)`

## Methods

- `public RayTraceResult getRayTraceResult()`

## Description

This event is fired when a projectile entity impacts something. This event is fired via ForgeEventFactory.onProjectileImpact(Entity, RayTraceResult) Subclasses of this event exist for more specific ty