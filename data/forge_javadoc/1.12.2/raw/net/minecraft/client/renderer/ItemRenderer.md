---
title: "ItemRenderer"
description: "public class ItemRenderer extends java.lang.Object"
package: "net/minecraft/client/renderer"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/renderer/ItemRenderer.html"
sourceType: javadoc
---

# ItemRenderer

## Class signature

```java
public class ItemRenderer extends java.lang.Object
```

## Constructors

- `public ItemRenderer( Minecraft mcIn)`

## Methods

- `public void renderItem( EntityLivingBase entityIn, ItemStack heldStack, ItemCameraTransforms.TransformType transform)`
- `public void renderItemSide( EntityLivingBase entitylivingbaseIn, ItemStack heldStack, ItemCameraTransforms.TransformType transform, boolean leftHanded)`
- `public void renderItemInFirstPerson(float partialTicks)`
- `public void renderItemInFirstPerson( AbstractClientPlayer player, float p_187457_2_, float p_187457_3_, EnumHand hand, float p_187457_5_, ItemStack stack, float p_187457_7_)`
- `public void renderOverlays(float partialTicks)`
- `public void updateEquippedItem()`
- `public void resetEquippedProgress( EnumHand hand)`
