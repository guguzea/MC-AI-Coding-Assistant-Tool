# ChunkGeneratorEvent.InitNoiseField

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.terraingen.ChunkGeneratorEvent → net.minecraftforge.event.terraingen.ChunkGeneratorEvent.InitNoiseField

## Class signature

```java
public static class ChunkGeneratorEvent.InitNoiseField extends ChunkGeneratorEvent
```

## Constructors

- `InitNoiseField(IChunkGenerator chunkProvider, double[] noisefield, int posX, int posY, int posZ, int sizeX, int sizeY, int sizeZ)`

## Methods

- `double[] getNoisefield()`
- `int getPosX()`
- `int getPosY()`
- `int getPosZ()`
- `int getSizeX()`
- `int getSizeY()`
- `int getSizeZ()`
- `void setNoisefield(double[] noisefield)`