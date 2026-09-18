---
title: "ThrowableImpactEvent"
description: "This event is fired before an EntityThrowable calls its EntityThrowable.onImpact(net.minecraft.util.math.RayTraceResult) method. This event is fired via ForgeHooks.onThrowableImpact(net.minecraft.enti"
package: "net/minecraftforge/event/entity"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/entity/ThrowableImpactEvent.html"
sourceType: javadoc
---

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
