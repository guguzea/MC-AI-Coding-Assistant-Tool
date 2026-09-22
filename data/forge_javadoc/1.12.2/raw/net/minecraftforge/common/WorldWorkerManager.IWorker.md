---
title: "WorldWorkerManager.IWorker"
description: "public static interface WorldWorkerManager.IWorker"
package: "net/minecraftforge/common"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/WorldWorkerManager.IWorker.html"
sourceType: javadoc
---

# WorldWorkerManager.IWorker

## Class signature

```java
public static interface WorldWorkerManager.IWorker
```

## Methods

- `default boolean doWork()` — Perform a task, returning true from this will have the manager call this function again this tick if there is time left.
- `boolean hasWork()`
- `default void work()`
