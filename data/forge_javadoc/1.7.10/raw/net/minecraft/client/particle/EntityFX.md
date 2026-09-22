---
title: "EntityFX"
description: "public class EntityFX extends Entity"
package: "net/minecraft/client/particle"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/client/particle/EntityFX.html"
sourceType: javadoc
---

# EntityFX

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.client.particle.EntityFX

## Class signature

```java
public class EntityFX extends Entity
```

## Constructors

- `EntityFX(World p_i1218_1_, double p_i1218_2_, double p_i1218_4_, double p_i1218_6_)`
- `EntityFX(World p_i1219_1_, double p_i1219_2_, double p_i1219_4_, double p_i1219_6_, double p_i1219_8_, double p_i1219_10_, double p_i1219_12_)`

## Methods

- `boolean canAttackWithItem()`
- `protected boolean canTriggerWalking()`
- `protected void entityInit()`
- `float getBlueColorF()`
- `int getFXLayer()`
- `float getGreenColorF()`
- `float getRedColorF()`
- `EntityFX multipleParticleScaleBy(float p_70541_1_)`
- `EntityFX multiplyVelocity(float p_70543_1_)`
- `void nextTextureIndexX()`
- `void onUpdate()`
- `void readEntityFromNBT(NBTTagCompound p_70037_1_)`
- `void renderParticle(Tessellator p_70539_1_, float p_70539_2_, float p_70539_3_, float p_70539_4_, float p_70539_5_, float p_70539_6_, float p_70539_7_)`
- `void setAlphaF(float p_82338_1_)`
- `void setParticleIcon(IIcon p_110125_1_)`
- `void setParticleTextureIndex(int p_70536_1_)`
- `void setRBGColorF(float p_70538_1_, float p_70538_2_, float p_70538_3_)`
- `java.lang.String toString()`
- `void writeEntityToNBT(NBTTagCompound p_70014_1_)`

## Fields

- `static double interpPosX`
- `static double interpPosY`
- `static double interpPosZ`
- `protected int particleAge`
- `protected float particleAlpha`
- `protected float particleBlue`
- `protected float particleGravity`
- `protected float particleGreen`
- `protected IIcon particleIcon`
- `protected int particleMaxAge`
- `protected float particleRed`
- `protected float particleScale`
- `protected int particleTextureIndexX`
- `protected int particleTextureIndexY`
- `protected float particleTextureJitterX`
- `protected float particleTextureJitterY`
