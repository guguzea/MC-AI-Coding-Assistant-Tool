# ModelArmorStand

**Inheritance:** java.lang.Object → net.minecraft.client.model.ModelBase → net.minecraft.client.model.ModelBiped → net.minecraft.client.model.ModelArmorStandArmor → net.minecraft.client.model.ModelArmorStand

## Class signature

```java
public class ModelArmorStand extends ModelArmorStandArmor
```

## Constructors

- `ModelArmorStand()`
- `ModelArmorStand(float modelSize)`

## Methods

- `void postRenderArm(float scale, EnumHandSide side)`
- `void render(Entity entityIn, float limbSwing, float limbSwingAmount, float ageInTicks, float netHeadYaw, float headPitch, float scale)`
- `void setRotationAngles(float limbSwing, float limbSwingAmount, float ageInTicks, float netHeadYaw, float headPitch, float scaleFactor, Entity entityIn)`

## Fields

- `ModelRenderer standBase`
- `ModelRenderer standLeftSide`
- `ModelRenderer standRightSide`
- `ModelRenderer standWaist`