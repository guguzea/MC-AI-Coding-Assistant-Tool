---
title: "ParticleManager"
description: "public class ParticleManager extends java.lang.Object"
package: "net/minecraft/client/particle"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/particle/ParticleManager.html"
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
- `void emitParticleAtEntity(Entity p_191271_1_, EnumParticleTypes p_191271_2_, int p_191271_3_)`
- `java.lang.String getStatistics()`
- `void registerParticle(int id, IParticleFactory particleFactory)`
- `void renderLitParticles(Entity entityIn, float partialTick)`
- `void renderParticles(Entity entityIn, float partialTicks)`
- `Particle spawnEffectParticle(int particleId, double xCoord, double yCoord, double zCoord, double xSpeed, double ySpeed, double zSpeed, int... parameters)`
- `void updateEffects()`

## Fields

- `protected World world`
