# ModelBiped

## Class signature

```java
public class ModelBiped extends ModelBase
```

## Constructors

- `public ModelBiped()`
- `public ModelBiped(float modelSize)`
- `public ModelBiped(float modelSize, float p_i1149_2_, int textureWidthIn, int textureHeightIn)`

## Methods

- `public void render( Entity entityIn, float limbSwing, float limbSwingAmount, float ageInTicks, float netHeadYaw, float headPitch, float scale)`
- `public void setRotationAngles(float limbSwing, float limbSwingAmount, float ageInTicks, float netHeadYaw, float headPitch, float scaleFactor, Entity entityIn)`
- `public void setModelAttributes( ModelBase model)`
- `public void setVisible(boolean visible)`
- `public void postRenderArm(float scale, EnumHandSide side)`
- `protected ModelRenderer getArmForSide( EnumHandSide side)`
- `protected EnumHandSide getMainHand( Entity entityIn)`