---
title: "ModelBase"
description: "public abstract class ModelBase extends java.lang.Object"
package: "net/minecraft/client/model"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/model/ModelBase.html"
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

- `public void render( Entity entityIn, float limbSwing, float limbSwingAmount, float ageInTicks, float netHeadYaw, float headPitch, float scale)`
- `public void setRotationAngles(float limbSwing, float limbSwingAmount, float ageInTicks, float netHeadYaw, float headPitch, float scaleFactor, Entity entityIn)`
- `public void setLivingAnimations( EntityLivingBase entitylivingbaseIn, float p_78086_2_, float p_78086_3_, float partialTickTime)`
- `public ModelRenderer getRandomModelBox(java.util.Random rand)`
- `protected void setTextureOffset(java.lang.String partName, int x, int y)`
- `public TextureOffset getTextureOffset(java.lang.String partName)`
- `public static void copyModelAngles( ModelRenderer source, ModelRenderer dest)`
- `public void setModelAttributes( ModelBase model)`
