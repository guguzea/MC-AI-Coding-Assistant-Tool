---
title: "ItemRenderer"
description: "public class ItemRenderer extends java.lang.Object"
package: "net/minecraft/client/renderer"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/renderer/ItemRenderer.html"
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
- `public void renderItemSide( EntityLivingBase entitylivingbaseIn, ItemStack heldStack, ItemCameraTransforms.TransformType transform, boolean p_187462_4_)`
- `public void renderItemInFirstPerson(float partialTicks)`
- `public void renderItemInFirstPerson( AbstractClientPlayer p_187457_1_, float p_187457_2_, float p_187457_3_, EnumHand p_187457_4_, float p_187457_5_, @Nullable ItemStack p_187457_6_, float p_187457_7_)`
- `public void renderOverlays(float partialTicks)`
- `public void updateEquippedItem()`
- `public void resetEquippedProgress( EnumHand hand)`
