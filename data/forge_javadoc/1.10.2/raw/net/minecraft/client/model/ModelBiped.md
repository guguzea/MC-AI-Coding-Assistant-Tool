---
title: "ModelBiped"
description: "public class ModelBiped extends ModelBase"
package: "net/minecraft/client/model"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/model/ModelBiped.html"
sourceType: javadoc
---

# ModelBiped

**Inheritance:** java.lang.Object → net.minecraft.client.model.ModelBase → net.minecraft.client.model.ModelBiped

## Class signature

```java
public class ModelBiped extends ModelBase
```

## Constructors

- `ModelBiped()`
- `ModelBiped(float modelSize)`
- `ModelBiped(float modelSize, float p_i1149_2_, int textureWidthIn, int textureHeightIn)`

## Methods

- `protected ModelRenderer getArmForSide(EnumHandSide side)`
- `protected EnumHandSide getMainHand(Entity entityIn)`
- `void postRenderArm(float scale, EnumHandSide side)`
- `void render(Entity entityIn, float limbSwing, float limbSwingAmount, float ageInTicks, float netHeadYaw, float headPitch, float scale)`
- `void setInvisible(boolean invisible)`
- `void setModelAttributes(ModelBase model)`
- `void setRotationAngles(float limbSwing, float limbSwingAmount, float ageInTicks, float netHeadYaw, float headPitch, float scaleFactor, Entity entityIn)`

## Fields

- `ModelRenderer bipedBody`
- `ModelRenderer bipedHead`
- `ModelRenderer bipedHeadwear`
- `ModelRenderer bipedLeftArm`
- `ModelRenderer bipedLeftLeg`
- `ModelRenderer bipedRightArm`
- `ModelRenderer bipedRightLeg`
- `boolean isSneak`
- `ModelBiped.ArmPose leftArmPose`
- `ModelBiped.ArmPose rightArmPose`
