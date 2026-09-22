---
title: "EffectRenderer"
description: "public class EffectRenderer extends java.lang.Object"
package: "net/minecraft/client/particle"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/particle/EffectRenderer.html"
sourceType: javadoc
---

# EffectRenderer

**Inheritance:** java.lang.Object → net.minecraft.client.particle.EffectRenderer

## Class signature

```java
public class EffectRenderer extends java.lang.Object
```

## Constructors

- `EffectRenderer(World worldIn, TextureManager rendererIn)`

## Methods

- `void addBlockDestroyEffects(BlockPos pos, IBlockState state)`
- `void addBlockHitEffects(BlockPos pos, EnumFacing side)` — Adds block hit particles for the specified block
- `void addBlockHitEffects(BlockPos pos, MovingObjectPosition target)`
- `void addEffect(EntityFX effect)`
- `void clearEffects(World worldIn)`
- `void emitParticleAtEntity(Entity entityIn, EnumParticleTypes particleTypes)`
- `java.lang.String getStatistics()`
- `void moveToAlphaLayer(EntityFX effect)`
- `void moveToNoAlphaLayer(EntityFX effect)`
- `void registerParticle(int id, IParticleFactory particleFactory)`
- `void renderLitParticles(Entity entityIn, float p_78872_2_)`
- `void renderParticles(Entity entityIn, float partialTicks)` — Renders all current particles.
- `EntityFX spawnEffectParticle(int particleId, double p_178927_2_, double p_178927_4_, double p_178927_6_, double p_178927_8_, double p_178927_10_, double p_178927_12_, int... p_178927_14_)` — Spawns the relevant particle according to the particle id.
- `void updateEffects()`

## Fields

- `protected World worldObj` — Reference to the World object.
