# ModelBoat

**Inheritance:** java.lang.Object → net.minecraft.client.model.ModelBase → net.minecraft.client.model.ModelBoat

## Class signature

```java
public class ModelBoat extends ModelBase implements IMultipassModel
```

## Constructors

- `ModelBoat()`

## Methods

- `void render(Entity entityIn, float limbSwing, float limbSwingAmount, float ageInTicks, float netHeadYaw, float headPitch, float scale)`
- `void renderMultipass(Entity p_187054_1_, float p_187054_2_, float p_187054_3_, float p_187054_4_, float p_187054_5_, float p_187054_6_, float scale)`
- `void setRotationAngles(float limbSwing, float limbSwingAmount, float ageInTicks, float netHeadYaw, float headPitch, float scaleFactor, Entity entityIn)`

## Fields

- `ModelRenderer [] boatSides`
- `ModelRenderer noWater`
- `ModelRenderer [] paddles`