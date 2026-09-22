---
title: "ModelRenderer"
description: "public class ModelRenderer extends java.lang.Object"
package: "net/minecraft/client/model"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/client/model/ModelRenderer.html"
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
- `ModelRenderer addBox(float offX, float offY, float offZ, int width, int height, int depth, boolean mirrored)`
- `void addBox(float offX, float offY, float offZ, int width, int height, int depth, float scaleFactor)`
- `ModelRenderer addBox(java.lang.String partName, float offX, float offY, float offZ, int width, int height, int depth)`
- `void addChild(ModelRenderer renderer)`
- `void postRender(float scale)`
- `void render(float scale)`
- `void renderWithRotation(float scale)`
- `void setRotationPoint(float rotationPointXIn, float rotationPointYIn, float rotationPointZIn)`
- `ModelRenderer setTextureOffset(int x, int y)`
- `ModelRenderer setTextureSize(int textureWidthIn, int textureHeightIn)`

## Fields

- `java.lang.String boxName`
- `java.util.List<ModelRenderer> childModels`
- `java.util.List<ModelBox> cubeList`
- `boolean isHidden`
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
- `float textureHeight`
- `float textureWidth`
