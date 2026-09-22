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