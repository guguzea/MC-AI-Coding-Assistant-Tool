---
title: "ItemCameraTransforms"
description: "public class ItemCameraTransforms extends java.lang.Object"
package: "net/minecraft/client/renderer/block/model"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/client/renderer/block/model/ItemCameraTransforms.html"
sourceType: javadoc
---

# ItemCameraTransforms

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.block.model.ItemCameraTransforms

## Class signature

```java
public class ItemCameraTransforms extends java.lang.Object
```

## Constructors

- `@Deprecated ItemCameraTransforms(ItemCameraTransforms transforms)`
- `@Deprecated ItemCameraTransforms(ItemTransformVec3f thirdperson_leftIn, ItemTransformVec3f thirdperson_rightIn, ItemTransformVec3f firstperson_leftIn, ItemTransformVec3f firstperson_rightIn, ItemTransformVec3f headIn, ItemTransformVec3f guiIn, ItemTransformVec3f groundIn, ItemTransformVec3f fixedIn)`

## Methods

- `void applyTransform(ItemCameraTransforms.TransformType type)`
- `static void applyTransformSide(ItemTransformVec3f vec, boolean leftHand)`
- `@Deprecated ItemTransformVec3f getTransform(ItemCameraTransforms.TransformType type)`
- `boolean hasCustomTransform(ItemCameraTransforms.TransformType type)`

## Fields

- `static ItemCameraTransforms DEFAULT`
- `ItemTransformVec3f firstperson_left`
- `ItemTransformVec3f firstperson_right`
- `ItemTransformVec3f fixed`
- `ItemTransformVec3f ground`
- `ItemTransformVec3f gui`
- `ItemTransformVec3f head`
- `static float offsetRotationX`
- `static float offsetRotationY`
- `static float offsetRotationZ`
- `static float offsetScaleX`
- `static float offsetScaleY`
- `static float offsetScaleZ`
- `static float offsetTranslateX`
- `static float offsetTranslateY`
- `static float offsetTranslateZ`
- `ItemTransformVec3f thirdperson_left`
- `ItemTransformVec3f thirdperson_right`
