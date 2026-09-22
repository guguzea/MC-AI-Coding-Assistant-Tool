# ChunkRenderContainer

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.ChunkRenderContainer

## Class signature

```java
public abstract class ChunkRenderContainer extends java.lang.Object
```

## Constructors

- `ChunkRenderContainer()`

## Methods

- `void addRenderChunk(RenderChunk renderChunkIn, BlockRenderLayer layer)`
- `void initialize(double viewEntityXIn, double viewEntityYIn, double viewEntityZIn)`
- `void preRenderChunk(RenderChunk renderChunkIn)`
- `abstract void renderChunkLayer(BlockRenderLayer layer)`

## Fields

- `protected boolean initialized`
- `protected java.util.List<RenderChunk> renderChunks`