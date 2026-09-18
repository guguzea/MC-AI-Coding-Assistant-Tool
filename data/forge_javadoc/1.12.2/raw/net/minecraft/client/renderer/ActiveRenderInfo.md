---
title: "ActiveRenderInfo"
description: "Vector from render view entity position (corrected for partialTickTime) to the middle of screen"
package: "net/minecraft/client/renderer"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/renderer/ActiveRenderInfo.html"
sourceType: javadoc
---

# ActiveRenderInfo

## Class signature

```java
public class ActiveRenderInfo extends java.lang.Object
```

## Constructors

- `public ActiveRenderInfo()`

## Methods

- `public static void updateRenderInfo( EntityPlayer entityplayerIn, boolean p_74583_1_)`
- `public static void updateRenderInfo( Entity entityplayerIn, boolean p_74583_1_)`
- `public static Vec3d projectViewFromEntity( Entity entityIn, double p_178806_1_)`
- `public static IBlockState getBlockStateAtEntityViewpoint( World worldIn, Entity entityIn, float p_186703_2_)`
- `public static float getRotationX()`
- `public static float getRotationXZ()`
- `public static float getRotationZ()`
- `public static float getRotationYZ()`
- `public static float getRotationXY()`
- `public static Vec3d getCameraPosition()`

## Description

Vector from render view entity position (corrected for partialTickTime) to the middle of screen
