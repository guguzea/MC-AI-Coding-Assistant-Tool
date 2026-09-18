# ChunkRenderWorker

## Class signature

```java
public class ChunkRenderWorker extends java.lang.Object implements java.lang.Runnable
```

## Constructors

- `public ChunkRenderWorker( ChunkRenderDispatcher chunkRenderDispatcherIn)`
- `public ChunkRenderWorker( ChunkRenderDispatcher chunkRenderDispatcherIn, @Nullable RegionRenderCacheBuilder regionRenderCacheBuilderIn)`

## Methods

- `public void run()`
- `protected void processTask( ChunkCompileTaskGenerator generator) throws java.lang.InterruptedException`
- `public void notifyToStop()`