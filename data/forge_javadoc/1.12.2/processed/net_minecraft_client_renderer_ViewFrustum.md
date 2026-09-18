# ViewFrustum

## Class signature

```java
public class ViewFrustum extends java.lang.Object
```

## Constructors

- `public ViewFrustum( World worldIn, int renderDistanceChunks, RenderGlobal renderGlobalIn, IRenderChunkFactory renderChunkFactory)`

## Methods

- `protected void createRenderChunks( IRenderChunkFactory renderChunkFactory)`
- `public void deleteGlResources()`
- `protected void setCountChunksXYZ(int renderDistanceChunks)`
- `public void updateChunkPositions(double viewEntityX, double viewEntityZ)`
- `public void markBlocksForUpdate(int minX, int minY, int minZ, int maxX, int maxY, int maxZ, boolean updateImmediately)`
- `protected RenderChunk getRenderChunk( BlockPos pos)`