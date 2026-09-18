# ModelPlayer

## Class signature

```java
public class ModelPlayer extends ModelBiped
```

## Constructors

- `public ModelPlayer(float modelSize, boolean smallArmsIn)`

## Methods

- `public void render( Entity entityIn, float limbSwing, float limbSwingAmount, float ageInTicks, float netHeadYaw, float headPitch, float scale)`
- `public void renderDeadmau5Head(float scale)`
- `public void renderCape(float scale)`
- `public void setRotationAngles(float limbSwing, float limbSwingAmount, float ageInTicks, float netHeadYaw, float headPitch, float scaleFactor, Entity entityIn)`
- `public void setInvisible(boolean invisible)`
- `public void postRenderArm(float scale, EnumHandSide side)`