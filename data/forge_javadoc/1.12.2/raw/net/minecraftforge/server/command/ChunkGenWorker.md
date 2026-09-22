---
title: "ChunkGenWorker"
description: "public class ChunkGenWorker extends java.lang.Object implements WorldWorkerManager.IWorker"
package: "net/minecraftforge/server/command"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/server/command/ChunkGenWorker.html"
sourceType: javadoc
---

# ChunkGenWorker

**Inheritance:** java.lang.Object → net.minecraftforge.server.command.ChunkGenWorker

## Class signature

```java
public class ChunkGenWorker extends java.lang.Object implements WorldWorkerManager.IWorker
```

## Constructors

- `ChunkGenWorker(ICommandSender listener, BlockPos start, int total, int dim, int interval)`

## Methods

- `protected java.util.Queue<BlockPos> buildQueue()`
- `boolean doWork()` — Perform a task, returning true from this will have the manager call this function again this tick if there is time left.
- `@Deprecated TextComponentTranslation getStartMessage()`
- `TextComponentBase getStartMessage(ICommandSender sender)`
- `boolean hasWork()`

## Fields

- `protected BlockPos start`
- `protected int total`
