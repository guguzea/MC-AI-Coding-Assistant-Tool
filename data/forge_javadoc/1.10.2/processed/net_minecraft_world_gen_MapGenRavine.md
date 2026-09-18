# MapGenRavine

## Class signature

```java
public class MapGenRavine extends MapGenBase
```

## Constructors

- `public MapGenRavine()`

## Methods

- `protected void addTunnel(long p_180707_1_, int p_180707_3_, int p_180707_4_, ChunkPrimer p_180707_5_, double p_180707_6_, double p_180707_8_, double p_180707_10_, float p_180707_12_, float p_180707_13_, float p_180707_14_, int p_180707_15_, int p_180707_16_, double p_180707_17_)`
- `protected void recursiveGenerate( World worldIn, int chunkX, int chunkZ, int p_180701_4_, int p_180701_5_, ChunkPrimer chunkPrimerIn)`
- `protected boolean isOceanBlock( ChunkPrimer data, int x, int y, int z, int chunkX, int chunkZ)`
- `protected void digBlock( ChunkPrimer data, int x, int y, int z, int chunkX, int chunkZ, boolean foundTop)`

## Description

Digs out the current block, default implementation removes stone, filler, and top block Sets the block to lava if y is less then 10, and air other wise.