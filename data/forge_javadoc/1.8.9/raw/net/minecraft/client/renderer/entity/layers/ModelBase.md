---
title: "ModelBase"
description: "Copies the angles from one object to another."
package: "net/minecraft/client/renderer/entity/layers"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/model/ModelBase.html"
sourceType: javadoc
---

# ModelBase

## Class signature

```java
public abstract class ModelBase extends java.lang.Object
```

## Constructors

- `public ModelBase()`

## Methods

- `public void render( Entity entityIn, float p_78088_2_, float p_78088_3_, float p_78088_4_, float p_78088_5_, float p_78088_6_, float scale)`
- `public void setRotationAngles(float p_78087_1_, float p_78087_2_, float p_78087_3_, float p_78087_4_, float p_78087_5_, float p_78087_6_, Entity entityIn)`
- `public void setLivingAnimations( EntityLivingBase entitylivingbaseIn, float p_78086_2_, float p_78086_3_, float partialTickTime)`
- `public ModelRenderer getRandomModelBox(java.util.Random rand)`
- `protected void setTextureOffset(java.lang.String partName, int x, int y)`
- `public TextureOffset getTextureOffset(java.lang.String partName)`
- `public static void copyModelAngles( ModelRenderer source, ModelRenderer dest)`
- `public void setModelAttributes( ModelBase model)`

## Description

Copies the angles from one object to another.
