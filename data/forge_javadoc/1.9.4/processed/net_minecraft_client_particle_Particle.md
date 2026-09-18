# Particle

## Class signature

```java
public class Particle extends java.lang.Object
```

## Constructors

- `protected Particle( World worldIn, double posXIn, double posYIn, double posZIn)`
- `public Particle( World worldIn, double xCoordIn, double yCoordIn, double zCoordIn, double xSpeedIn, double ySpeedIn, double zSpeedIn)`

## Methods

- `public Particle multiplyVelocity(float multiplier)`
- `public Particle multipleParticleScaleBy(float scale)`
- `public void setRBGColorF(float particleRedIn, float particleGreenIn, float particleBlueIn)`
- `public void setAlphaF(float alpha)`
- `public boolean isTransparent()`
- `public float getRedColorF()`
- `public float getGreenColorF()`
- `public float getBlueColorF()`
- `public void setMaxAge(int p_187114_1_)`
- `public void onUpdate()`
- `public void renderParticle( VertexBuffer worldRendererIn, Entity entityIn, float partialTicks, float rotationX, float rotationZ, float rotationYZ, float rotationXY, float rotationXZ)`
- `public int getFXLayer()`
- `public void setParticleTexture( TextureAtlasSprite texture)`
- `public void setParticleTextureIndex(int particleTextureIndex)`
- `public void nextTextureIndexX()`
- `public java.lang.String toString()`
- `public void setExpired()`
- `protected void setSize(float p_187115_1_, float p_187115_2_)`
- `public void setPosition(double p_187109_1_, double p_187109_3_, double p_187109_5_)`
- `public void moveEntity(double x, double y, double z)`
- `protected void resetPositionToBB()`
- `public int getBrightnessForRender(float p_189214_1_)`
- `public boolean isAlive()`
- `public AxisAlignedBB getEntityBoundingBox()`
- `public void setEntityBoundingBox( AxisAlignedBB p_187108_1_)`