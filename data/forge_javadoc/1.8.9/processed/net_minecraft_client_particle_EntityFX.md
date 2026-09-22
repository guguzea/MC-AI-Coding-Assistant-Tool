# EntityFX

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.client.particle.EntityFX

## Class signature

```java
public class EntityFX extends Entity
```

## Constructors

- `EntityFX(World worldIn, double posXIn, double posYIn, double posZIn)`
- `EntityFX(World worldIn, double xCoordIn, double yCoordIn, double zCoordIn, double xSpeedIn, double ySpeedIn, double zSpeedIn)`

## Methods

- `boolean canAttackWithItem()` — If returns false, the item will not inflict any damage against entities.
- `protected boolean canTriggerWalking()` — returns if this entity triggers Block.onEntityWalking on the blocks they walk on. used for spiders and wolves to prevent them from trampling crops
- `protected void entityInit()`
- `float getAlpha()`
- `float getBlueColorF()`
- `int getFXLayer()`
- `float getGreenColorF()`
- `float getRedColorF()`
- `EntityFX multipleParticleScaleBy(float p_70541_1_)`
- `EntityFX multiplyVelocity(float multiplier)`
- `void nextTextureIndexX()`
- `void onUpdate()` — Called to update the entity's position/logic.
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void renderParticle(WorldRenderer worldRendererIn, Entity entityIn, float partialTicks, float p_180434_4_, float p_180434_5_, float p_180434_6_, float p_180434_7_, float p_180434_8_)` — Renders the particle
- `void setAlphaF(float alpha)` — Sets the particle alpha (float)
- `void setParticleIcon(TextureAtlasSprite icon)` — Sets the particle's icon.
- `void setParticleTextureIndex(int particleTextureIndex)` — Public method to set private field particleTextureIndex.
- `void setRBGColorF(float particleRedIn, float particleGreenIn, float particleBlueIn)`
- `java.lang.String toString()`
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `static double interpPosX`
- `static double interpPosY`
- `static double interpPosZ`
- `protected int particleAge`
- `protected float particleAlpha` — Particle alpha
- `protected float particleBlue` — The blue amount of color.
- `protected float particleGravity`
- `protected float particleGreen` — The green amount of color.
- `protected TextureAtlasSprite particleIcon` — The icon field from which the given particle pulls its texture.
- `protected int particleMaxAge`
- `protected float particleRed` — The red amount of color.
- `protected float particleScale`
- `protected int particleTextureIndexX`
- `protected int particleTextureIndexY`
- `protected float particleTextureJitterX`
- `protected float particleTextureJitterY`