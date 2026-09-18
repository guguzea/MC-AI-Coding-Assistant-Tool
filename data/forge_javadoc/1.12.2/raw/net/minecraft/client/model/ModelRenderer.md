---
title: "ModelRenderer"
description: "public class ModelRenderer extends java.lang.Object"
package: "net/minecraft/client/model"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/model/ModelRenderer.html"
sourceType: javadoc
---

# ModelRenderer

## Class signature

```java
public class ModelRenderer extends java.lang.Object
```

## Constructors

- `public ModelRenderer( ModelBase model, java.lang.String boxNameIn)`
- `public ModelRenderer( ModelBase model)`
- `public ModelRenderer( ModelBase model, int texOffX, int texOffY)`

## Methods

- `public void addChild( ModelRenderer renderer)`
- `public ModelRenderer setTextureOffset(int x, int y)`
- `public ModelRenderer addBox(java.lang.String partName, float offX, float offY, float offZ, int width, int height, int depth)`
- `public ModelRenderer addBox(float offX, float offY, float offZ, int width, int height, int depth)`
- `public ModelRenderer addBox(float offX, float offY, float offZ, int width, int height, int depth, boolean mirrored)`
- `public void addBox(float offX, float offY, float offZ, int width, int height, int depth, float scaleFactor)`
- `public void setRotationPoint(float rotationPointXIn, float rotationPointYIn, float rotationPointZIn)`
- `public void render(float scale)`
- `public void renderWithRotation(float scale)`
- `public void postRender(float scale)`
- `public ModelRenderer setTextureSize(int textureWidthIn, int textureHeightIn)`
