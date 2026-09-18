---
title: "FillBucketEvent"
description: "This event is fired when a player attempts to use a Empty bucket, it can be canceled to completely prevent any further processing. If you set the result to 'ALLOW', it means that you have processed th"
package: "net/minecraftforge/event/entity/player"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/entity/player/FillBucketEvent.html"
sourceType: javadoc
---

# FillBucketEvent

## Class signature

```java
public class FillBucketEvent extends PlayerEvent
```

## Constructors

- `public FillBucketEvent( EntityPlayer player, @Nonnull ItemStack current, World world, @Nullable RayTraceResult target)`

## Methods

- `@Nonnull public ItemStack getEmptyBucket()`
- `public World getWorld()`
- `@Nullable public RayTraceResult getTarget()`
- `@Nonnull public ItemStack getFilledBucket()`
- `public void setFilledBucket(@Nonnull ItemStack bucket)`

## Description

This event is fired when a player attempts to use a Empty bucket, it can be canceled to completely prevent any further processing. If you set the result to 'ALLOW', it means that you have processed th
