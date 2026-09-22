---
title: "ForgeChunkManager.LoadingCallback"
description: "public static interface ForgeChunkManager.LoadingCallback"
package: "net/minecraftforge/common"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/common/ForgeChunkManager.LoadingCallback.html"
sourceType: javadoc
---

# ForgeChunkManager.LoadingCallback

## Class signature

```java
public static interface ForgeChunkManager.LoadingCallback
```

## Methods

- `void ticketsLoaded(java.util.List<ForgeChunkManager.Ticket> tickets, World world)` — Called back when tickets are loaded from the world to allow the mod to re-register the chunks associated with those tickets.
