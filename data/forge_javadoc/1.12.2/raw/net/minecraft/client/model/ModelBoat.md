---
title: "ModelBoat"
description: "public class ModelBoat extends ModelBase implements IMultipassModel"
package: "net/minecraft/client/model"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/model/ModelBoat.html"
sourceType: javadoc
---

# ModelBoat

**Inheritance:** java.lang.Object → net.minecraft.client.model.ModelBase → net.minecraft.client.model.ModelBoat

## Class signature

```java
public class ModelBoat extends ModelBase implements IMultipassModel
```

## Constructors

- `ModelBoat()`

## Methods

- `protected ModelRenderer makePaddle(boolean p_187056_1_)`
- `void render(Entity entityIn, float limbSwing, float limbSwingAmount, float ageInTicks, float netHeadYaw, float headPitch, float scale)`
- `void renderMultipass(Entity p_187054_1_, float p_187054_2_, float p_187054_3_, float p_187054_4_, float p_187054_5_, float p_187054_6_, float scale)`
- `protected void renderPaddle(EntityBoat boat, int paddle, float scale, float limbSwing)`

## Fields

- `ModelRenderer [] boatSides`
- `ModelRenderer noWater`
- `ModelRenderer [] paddles`
