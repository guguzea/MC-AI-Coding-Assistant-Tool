---
title: "ModelPlayer"
description: "public class ModelPlayer extends ModelBiped"
package: "net/minecraft/client/model"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/client/model/ModelPlayer.html"
sourceType: javadoc
---

# ModelPlayer

**Inheritance:** java.lang.Object → net.minecraft.client.model.ModelBase → net.minecraft.client.model.ModelBiped → net.minecraft.client.model.ModelPlayer

## Class signature

```java
public class ModelPlayer extends ModelBiped
```

## Constructors

- `ModelPlayer(float modelSize, boolean smallArmsIn)`

## Methods

- `void postRenderArm(float scale, EnumHandSide side)`
- `void render(Entity entityIn, float limbSwing, float limbSwingAmount, float ageInTicks, float netHeadYaw, float headPitch, float scale)`
- `void renderCape(float scale)`
- `void renderDeadmau5Head(float scale)`
- `void setInvisible(boolean invisible)`
- `void setRotationAngles(float limbSwing, float limbSwingAmount, float ageInTicks, float netHeadYaw, float headPitch, float scaleFactor, Entity entityIn)`

## Fields

- `ModelRenderer bipedBodyWear`
- `ModelRenderer bipedLeftArmwear`
- `ModelRenderer bipedLeftLegwear`
- `ModelRenderer bipedRightArmwear`
- `ModelRenderer bipedRightLegwear`
