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

- `void postRenderArm(float scale)`
- `void render(Entity entityIn, float p_78088_2_, float p_78088_3_, float p_78088_4_, float p_78088_5_, float p_78088_6_, float scale)` — Sets the models various rotation angles then renders the model.
- `void setInvisible(boolean invisible)`
- `void setModelAttributes(ModelBase model)`
- `void setRotationAngles(float p_78087_1_, float p_78087_2_, float p_78087_3_, float p_78087_4_, float p_78087_5_, float p_78087_6_, Entity entityIn)` — Sets the model's various rotation angles.

## Fields

- `boolean aimedBow` — Records whether the model should be rendered aiming a bow.
- `ModelRenderer bipedBody`
- `ModelRenderer bipedHead`
- `ModelRenderer bipedHeadwear` — The Biped's Headwear.
- `ModelRenderer bipedLeftArm` — The Biped's Left Arm
- `ModelRenderer bipedLeftLeg` — The Biped's Left Leg
- `ModelRenderer bipedRightArm` — The Biped's Right Arm
- `ModelRenderer bipedRightLeg` — The Biped's Right Leg
- `int heldItemLeft` — Records whether the model should be rendered holding an item in the left hand, and if that item is a block.
- `int heldItemRight` — Records whether the model should be rendered holding an item in the right hand, and if that item is a block.
- `boolean isSneak`