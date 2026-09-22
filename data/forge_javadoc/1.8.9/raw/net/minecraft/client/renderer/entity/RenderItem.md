---
title: "RenderItem"
description: "public class RenderItem extends java.lang.Object implements IResourceManagerReloadListener"
package: "net/minecraft/client/renderer/entity"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/entity/RenderItem.html"
sourceType: javadoc
---

# RenderItem

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.entity.RenderItem

## Class signature

```java
public class RenderItem extends java.lang.Object implements IResourceManagerReloadListener
```

## Constructors

- `RenderItem(TextureManager textureManager, ModelManager modelManager)`

## Methods

- `void func_175039_a(boolean p_175039_1_)`
- `ItemModelMesher getItemModelMesher()`
- `void onResourceManagerReload(IResourceManager resourceManager)`
- `protected void registerBlock(Block blk, int subType, java.lang.String identifier)`
- `protected void registerItem(Item itm, int subType, java.lang.String identifier)`
- `void renderItem(ItemStack stack, IBakedModel model)`
- `void renderItem(ItemStack p_181564_1_, ItemCameraTransforms.TransformType p_181564_2_)`
- `void renderItemAndEffectIntoGUI(ItemStack stack, int xPosition, int yPosition)`
- `void renderItemIntoGUI(ItemStack stack, int x, int y)`
- `void renderItemModelForEntity(ItemStack stack, EntityLivingBase entityToRenderFor, ItemCameraTransforms.TransformType cameraTransformType)`
- `protected void renderItemModelTransform(ItemStack stack, IBakedModel model, ItemCameraTransforms.TransformType cameraTransformType)`
- `void renderItemOverlayIntoGUI(FontRenderer fr, ItemStack stack, int xPosition, int yPosition, java.lang.String text)` — Renders the stack size and/or damage bar for the given ItemStack.
- `void renderItemOverlays(FontRenderer fr, ItemStack stack, int xPosition, int yPosition)`
- `boolean shouldRenderItemIn3D(ItemStack stack)`

## Fields

- `float zLevel` — Defines the zLevel of rendering of item on GUI.
