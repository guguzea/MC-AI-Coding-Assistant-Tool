# EffectRenderer

## Class signature

```java
public class EffectRenderer extends java.lang.Object
```

## Constructors

- `public EffectRenderer( World worldIn, TextureManager rendererIn)`

## Methods

- `public void registerParticle(int id, IParticleFactory particleFactory)`
- `public void emitParticleAtEntity( Entity entityIn, EnumParticleTypes particleTypes)`
- `public EntityFX spawnEffectParticle(int particleId, double p_178927_2_, double p_178927_4_, double p_178927_6_, double p_178927_8_, double p_178927_10_, double p_178927_12_, int... p_178927_14_)`
- `public void addEffect( EntityFX effect)`
- `public void updateEffects()`
- `public void renderParticles( Entity entityIn, float partialTicks)`
- `public void renderLitParticles( Entity entityIn, float p_78872_2_)`
- `public void clearEffects( World worldIn)`
- `public void addBlockDestroyEffects( BlockPos pos, IBlockState state)`
- `public void addBlockHitEffects( BlockPos pos, EnumFacing side)`
- `public void moveToAlphaLayer( EntityFX effect)`
- `public void moveToNoAlphaLayer( EntityFX effect)`
- `public java.lang.String getStatistics()`
- `public void addBlockHitEffects( BlockPos pos, MovingObjectPosition target)`

## Description

Reference to the World object.