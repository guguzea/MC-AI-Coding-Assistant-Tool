# ChunkGenWorker

## Class signature

```java
public class ChunkGenWorker extends java.lang.Object implements WorldWorkerManager.IWorker
```

## Constructors

- `public ChunkGenWorker( ICommandSender listener, BlockPos start, int total, int dim, int interval)`

## Methods

- `protected java.util.Queue< BlockPos > buildQueue()`
- `@Deprecated public TextComponentTranslation getStartMessage()`
- `public TextComponentBase getStartMessage( ICommandSender sender)`
- `public boolean hasWork()`
- `public boolean doWork()`

## Description

Perform a task, returning true from this will have the manager call this function again this tick if there is time left.