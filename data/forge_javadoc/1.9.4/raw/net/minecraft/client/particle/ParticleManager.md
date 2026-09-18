---
title: "ParticleManager"
description: "public class ParticleManager extends java.lang.Object"
package: "net/minecraft/client/particle"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/particle/ParticleManager.html"
sourceType: javadoc
---

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
- `@Nullable public Particle spawnEffectParticle(int particleId, double xCoord, double yCoord, double zCoord, double xSpeed, double ySpeed, double zSpeed, int... parameters)`
- `public void addEffect( Particle effect)`
- `public void updateEffects()`
- `public void renderParticles( Entity entityIn, float partialTicks)`
- `public void renderLitParticles( Entity entityIn, float partialTick)`
- `public void clearEffects(@Nullable World worldIn)`
- `public void addBlockDestroyEffects( BlockPos pos, IBlockState state)`
- `public void addBlockHitEffects( BlockPos pos, EnumFacing side)`
- `public java.lang.String getStatistics()`
- `public void addBlockHitEffects( BlockPos pos, RayTraceResult target)`
