# EntityFX

## Class signature

```java
public class EntityFX extends Entity
```

## Constructors

- `protected EntityFX( World worldIn, double posXIn, double posYIn, double posZIn)`
- `public EntityFX( World worldIn, double xCoordIn, double yCoordIn, double zCoordIn, double xSpeedIn, double ySpeedIn, double zSpeedIn)`

## Methods

- `public EntityFX multiplyVelocity(float multiplier)`
- `public EntityFX multipleParticleScaleBy(float p_70541_1_)`
- `public void setRBGColorF(float particleRedIn, float particleGreenIn, float particleBlueIn)`
- `public void setAlphaF(float alpha)`
- `public float getRedColorF()`
- `public float getGreenColorF()`
- `public float getBlueColorF()`
- `public float getAlpha()`
- `protected boolean canTriggerWalking()`
- `protected void entityInit()`
- `public void onUpdate()`
- `public void renderParticle( WorldRenderer worldRendererIn, Entity entityIn, float partialTicks, float p_180434_4_, float p_180434_5_, float p_180434_6_, float p_180434_7_, float p_180434_8_)`
- `public int getFXLayer()`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public void setParticleIcon( TextureAtlasSprite icon)`
- `public void setParticleTextureIndex(int particleTextureIndex)`
- `public void nextTextureIndexX()`
- `public boolean canAttackWithItem()`
- `public java.lang.String toString()`

## Description

Particle alpha