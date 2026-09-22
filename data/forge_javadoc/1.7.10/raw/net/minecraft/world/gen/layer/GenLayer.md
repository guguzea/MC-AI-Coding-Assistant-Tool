---
title: "GenLayer"
description: "public abstract class GenLayer extends java.lang.Object"
package: "net/minecraft/world/gen/layer"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/world/gen/layer/GenLayer.html"
sourceType: javadoc
---

# GenLayer

**Inheritance:** java.lang.Object → net.minecraft.world.gen.layer.GenLayer

## Class signature

```java
public abstract class GenLayer extends java.lang.Object
```

## Constructors

- `GenLayer(long p_i2125_1_)`

## Methods

- `protected static boolean compareBiomesById(int p_151616_0_, int p_151616_1_)`
- `abstract int[] getInts(int p_75904_1_, int p_75904_2_, int p_75904_3_, int p_75904_4_)`
- `void initChunkSeed(long p_75903_1_, long p_75903_3_)`
- `static GenLayer [] initializeAllBiomeGenerators(long p_75901_0_, WorldType p_75901_2_)`
- `void initWorldGenSeed(long p_75905_1_)`
- `protected static boolean isBiomeOceanic(int p_151618_0_)`
- `protected int nextInt(int p_75902_1_)`
- `protected int selectModeOrRandom(int p_151617_1_, int p_151617_2_, int p_151617_3_, int p_151617_4_)`
- `protected int selectRandom(int... p_151619_1_)`

## Fields

- `protected long baseSeed`
- `protected GenLayer parent`
