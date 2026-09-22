---
title: "ModelBase"
description: "public abstract class ModelBase extends java.lang.Object"
package: "net/minecraft/client/model"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/model/ModelBase.html"
sourceType: javadoc
---

# ModelBase

**Inheritance:** java.lang.Object → net.minecraft.client.model.ModelBase

## Class signature

```java
public abstract class ModelBase extends java.lang.Object
```

## Constructors

- `ModelBase()`

## Methods

- `static void copyModelAngles(ModelRenderer source, ModelRenderer dest)` — Copies the angles from one object to another.
- `ModelRenderer getRandomModelBox(java.util.Random rand)`
- `TextureOffset getTextureOffset(java.lang.String partName)`
- `void render(Entity entityIn, float p_78088_2_, float p_78088_3_, float p_78088_4_, float p_78088_5_, float p_78088_6_, float scale)` — Sets the models various rotation angles then renders the model.
- `void setLivingAnimations(EntityLivingBase entitylivingbaseIn, float p_78086_2_, float p_78086_3_, float partialTickTime)` — Used for easily adding entity-dependent animations.
- `void setModelAttributes(ModelBase model)`
- `void setRotationAngles(float p_78087_1_, float p_78087_2_, float p_78087_3_, float p_78087_4_, float p_78087_5_, float p_78087_6_, Entity entityIn)` — Sets the model's various rotation angles.
- `protected void setTextureOffset(java.lang.String partName, int x, int y)`

## Fields

- `java.util.List<ModelRenderer> boxList`
- `boolean isChild`
- `boolean isRiding`
- `float swingProgress`
- `int textureHeight`
- `int textureWidth`
