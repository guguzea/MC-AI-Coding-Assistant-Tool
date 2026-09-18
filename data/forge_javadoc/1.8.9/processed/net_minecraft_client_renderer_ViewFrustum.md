# ViewFrustum

## Class signature

```java
public class ViewFrustum extends java.lang.Object
```

## Constructors

- `public ViewFrustum( World worldIn, int renderDistanceChunks, RenderGlobal p_i46246_3_, IRenderChunkFactory renderChunkFactory)`

## Methods

- `protected void createRenderChunks( IRenderChunkFactory renderChunkFactory)`
- `public void deleteGlResources()`
- `protected void setCountChunksXYZ(int renderDistanceChunks)`
- `public void updateChunkPositions(double viewEntityX, double viewEntityZ)`
- `public void markBlocksForUpdate(int fromX, int fromY, int fromZ, int toX, int toY, int toZ)`
- `protected RenderChunk getRenderChunk( BlockPos pos)`