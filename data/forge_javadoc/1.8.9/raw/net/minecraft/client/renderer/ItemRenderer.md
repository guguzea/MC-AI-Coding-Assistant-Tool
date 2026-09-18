---
title: "ItemRenderer"
description: "Renders the active item in the player's hand when in first person mode."
package: "net/minecraft/client/renderer"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/ItemRenderer.html"
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
- `public void renderItemInFirstPerson(float partialTicks)`
- `public void renderOverlays(float partialTicks)`
- `public void updateEquippedItem()`
- `public void resetEquippedProgress()`
- `public void resetEquippedProgress2()`

## Description

Renders the active item in the player's hand when in first person mode.
