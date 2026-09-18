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
- `public ModelRenderer addBox(float p_178769_1_, float p_178769_2_, float p_178769_3_, int p_178769_4_, int p_178769_5_, int p_178769_6_, boolean p_178769_7_)`
- `public void addBox(float p_78790_1_, float p_78790_2_, float p_78790_3_, int width, int height, int depth, float scaleFactor)`
- `public void setRotationPoint(float rotationPointXIn, float rotationPointYIn, float rotationPointZIn)`
- `public void render(float p_78785_1_)`
- `public void renderWithRotation(float p_78791_1_)`
- `public void postRender(float scale)`
- `public ModelRenderer setTextureSize(int textureWidthIn, int textureHeightIn)`

## Description

Hides the model.