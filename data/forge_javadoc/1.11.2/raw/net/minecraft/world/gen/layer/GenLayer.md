---
title: "GenLayer"
description: "public abstract class GenLayer extends java.lang.Object"
package: "net/minecraft/world/gen/layer"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/gen/layer/GenLayer.html"
sourceType: javadoc
---

# GenLayer

## Class signature

```java
public abstract class GenLayer extends java.lang.Object
```

## Constructors

- `public GenLayer(long p_i2125_1_)`

## Methods

- `public static GenLayer [] initializeAllBiomeGenerators(long seed, WorldType p_180781_2_, ChunkProviderSettings p_180781_3_)`
- `public void initWorldGenSeed(long seed)`
- `public void initChunkSeed(long p_75903_1_, long p_75903_3_)`
- `protected int nextInt(int p_75902_1_)`
- `public abstract int[] getInts(int areaX, int areaY, int areaWidth, int areaHeight)`
- `protected static boolean biomesEqualOrMesaPlateau(int biomeIDA, int biomeIDB)`
- `protected static boolean isBiomeOceanic(int p_151618_0_)`
- `protected int selectRandom(int... p_151619_1_)`
- `protected int selectModeOrRandom(int p_151617_1_, int p_151617_2_, int p_151617_3_, int p_151617_4_)`
- `protected long nextLong(long par1)`
- `public static int getModdedBiomeSize( WorldType worldType, int original)`
