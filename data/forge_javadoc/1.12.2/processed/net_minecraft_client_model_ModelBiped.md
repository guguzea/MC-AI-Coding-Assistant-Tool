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
- `void setModelAttributes(ModelBase model)`
- `void setRotationAngles(float limbSwing, float limbSwingAmount, float ageInTicks, float netHeadYaw, float headPitch, float scaleFactor, Entity entityIn)`
- `void setVisible(boolean visible)`

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