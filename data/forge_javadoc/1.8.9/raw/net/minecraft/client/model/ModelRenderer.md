---
title: "ModelRenderer"
description: "public class ModelRenderer extends java.lang.Object"
package: "net/minecraft/client/model"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/model/ModelRenderer.html"
sourceType: javadoc
---

# ModelRenderer

**Inheritance:** java.lang.Object → net.minecraft.client.model.ModelRenderer

## Class signature

```java
public class ModelRenderer extends java.lang.Object
```

## Constructors

- `ModelRenderer(ModelBase model)`
- `ModelRenderer(ModelBase model, int texOffX, int texOffY)`
- `ModelRenderer(ModelBase model, java.lang.String boxNameIn)`

## Methods

- `ModelRenderer addBox(float offX, float offY, float offZ, int width, int height, int depth)`
- `ModelRenderer addBox(float p_178769_1_, float p_178769_2_, float p_178769_3_, int p_178769_4_, int p_178769_5_, int p_178769_6_, boolean p_178769_7_)`
- `void addBox(float p_78790_1_, float p_78790_2_, float p_78790_3_, int width, int height, int depth, float scaleFactor)` — Creates a textured box.
- `ModelRenderer addBox(java.lang.String partName, float offX, float offY, float offZ, int width, int height, int depth)`
- `void addChild(ModelRenderer renderer)` — Sets the current box's rotation points and rotation angles to another box.
- `void postRender(float scale)` — Allows the changing of Angles after a box has been rendered
- `void render(float p_78785_1_)`
- `void renderWithRotation(float p_78791_1_)`
- `void setRotationPoint(float rotationPointXIn, float rotationPointYIn, float rotationPointZIn)`
- `ModelRenderer setTextureOffset(int x, int y)`
- `ModelRenderer setTextureSize(int textureWidthIn, int textureHeightIn)` — Returns the model renderer with the new texture parameters.

## Fields

- `java.lang.String boxName`
- `java.util.List<ModelRenderer> childModels`
- `java.util.List<ModelBox> cubeList`
- `boolean isHidden` — Hides the model.
- `boolean mirror`
- `float offsetX`
- `float offsetY`
- `float offsetZ`
- `float rotateAngleX`
- `float rotateAngleY`
- `float rotateAngleZ`
- `float rotationPointX`
- `float rotationPointY`
- `float rotationPointZ`
- `boolean showModel`
- `float textureHeight` — The size of the texture file's height in pixels.
- `float textureWidth` — The size of the texture file's width in pixels.
