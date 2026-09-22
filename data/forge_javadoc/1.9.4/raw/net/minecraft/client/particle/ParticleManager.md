---
title: "ParticleManager"
description: "public class ParticleManager extends java.lang.Object"
package: "net/minecraft/client/particle"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/particle/ParticleManager.html"
sourceType: javadoc
---

# ParticleManager

**Inheritance:** java.lang.Object → net.minecraft.client.particle.ParticleManager

## Class signature

```java
public class ParticleManager extends java.lang.Object
```

## Constructors

- `ParticleManager(World worldIn, TextureManager rendererIn)`

## Methods

- `void addBlockDestroyEffects(BlockPos pos, IBlockState state)`
- `void addBlockHitEffects(BlockPos pos, EnumFacing side)`
- `void addBlockHitEffects(BlockPos pos, RayTraceResult target)`
- `void addEffect(Particle effect)`
- `void clearEffects(World worldIn)`
- `void emitParticleAtEntity(Entity entityIn, EnumParticleTypes particleTypes)`
- `java.lang.String getStatistics()`
- `void registerParticle(int id, IParticleFactory particleFactory)`
- `void renderLitParticles(Entity entityIn, float partialTick)`
- `void renderParticles(Entity entityIn, float partialTicks)`
- `Particle spawnEffectParticle(int particleId, double xCoord, double yCoord, double zCoord, double xSpeed, double ySpeed, double zSpeed, int... parameters)`
- `void updateEffects()`

## Fields

- `protected World worldObj`
