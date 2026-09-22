# ModelBase

**Inheritance:** java.lang.Object → net.minecraft.client.model.ModelBase

## Class signature

```java
public abstract class ModelBase extends java.lang.Object
```

## Constructors

- `ModelBase()`

## Methods

- `static void copyModelAngles(ModelRenderer source, ModelRenderer dest)`
- `ModelRenderer getRandomModelBox(java.util.Random rand)`
- `TextureOffset getTextureOffset(java.lang.String partName)`
- `void render(Entity entityIn, float limbSwing, float limbSwingAmount, float ageInTicks, float netHeadYaw, float headPitch, float scale)`
- `void setLivingAnimations(EntityLivingBase entitylivingbaseIn, float limbSwing, float limbSwingAmount, float partialTickTime)`
- `void setModelAttributes(ModelBase model)`
- `void setRotationAngles(float limbSwing, float limbSwingAmount, float ageInTicks, float netHeadYaw, float headPitch, float scaleFactor, Entity entityIn)`
- `protected void setTextureOffset(java.lang.String partName, int x, int y)`

## Fields

- `java.util.List<ModelRenderer> boxList`
- `boolean isChild`
- `boolean isRiding`
- `float swingProgress`
- `int textureHeight`
- `int textureWidth`