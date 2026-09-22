# MapGenCaves

**Inheritance:** java.lang.Object → net.minecraft.world.gen.MapGenBase → net.minecraft.world.gen.MapGenCaves

## Class signature

```java
public class MapGenCaves extends MapGenBase
```

## Constructors

- `MapGenCaves()`

## Methods

- `protected void addRoom(long p_180703_1_, int p_180703_3_, int p_180703_4_, ChunkPrimer p_180703_5_, double p_180703_6_, double p_180703_8_, double p_180703_10_)`
- `protected void addTunnel(long p_180702_1_, int p_180702_3_, int p_180702_4_, ChunkPrimer p_180702_5_, double p_180702_6_, double p_180702_8_, double p_180702_10_, float p_180702_12_, float p_180702_13_, float p_180702_14_, int p_180702_15_, int p_180702_16_, double p_180702_17_)`
- `protected boolean canReplaceBlock(IBlockState p_175793_1_, IBlockState p_175793_2_)`
- `protected void digBlock(ChunkPrimer data, int x, int y, int z, int chunkX, int chunkZ, boolean foundTop, IBlockState state, IBlockState up)` — Digs out the current block, default implementation removes stone, filler, and top block Sets the block to lava if y is less then 10, and air other wise.
- `protected boolean isOceanBlock(ChunkPrimer data, int x, int y, int z, int chunkX, int chunkZ)`
- `protected void recursiveGenerate(World worldIn, int chunkX, int chunkZ, int p_180701_4_, int p_180701_5_, ChunkPrimer chunkPrimerIn)`

## Fields

- `protected static IBlockState BLK_AIR`
- `protected static IBlockState BLK_LAVA`
- `protected static IBlockState BLK_RED_SANDSTONE`
- `protected static IBlockState BLK_SANDSTONE`