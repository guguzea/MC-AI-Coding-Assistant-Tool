# ParticleManager

## Class signature

```java
public class ParticleManager extends java.lang.Object
```

## Constructors

- `public ParticleManager( World worldIn, TextureManager rendererIn)`

## Methods

- `public void registerParticle(int id, IParticleFactory particleFactory)`
- `public void emitParticleAtEntity( Entity entityIn, EnumParticleTypes particleTypes)`
- `public void emitParticleAtEntity( Entity p_191271_1_, EnumParticleTypes p_191271_2_, int p_191271_3_)`
- `public Particle spawnEffectParticle(int particleId, double xCoord, double yCoord, double zCoord, double xSpeed, double ySpeed, double zSpeed, int... parameters)`
- `public void addEffect( Particle effect)`
- `public void updateEffects()`
- `public void renderParticles( Entity entityIn, float partialTicks)`
- `public void renderLitParticles( Entity entityIn, float partialTick)`
- `public void clearEffects( World worldIn)`
- `public void addBlockDestroyEffects( BlockPos pos, IBlockState state)`
- `public void addBlockHitEffects( BlockPos pos, EnumFacing side)`
- `public java.lang.String getStatistics()`
- `public void addBlockHitEffects( BlockPos pos, RayTraceResult target)`