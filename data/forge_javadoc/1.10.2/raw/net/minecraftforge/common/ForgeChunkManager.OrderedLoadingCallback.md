---
title: "ForgeChunkManager.OrderedLoadingCallback"
description: "public static interface ForgeChunkManager.OrderedLoadingCallback extends ForgeChunkManager.LoadingCallback"
package: "net/minecraftforge/common"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/common/ForgeChunkManager.OrderedLoadingCallback.html"
sourceType: javadoc
---

# ForgeChunkManager.OrderedLoadingCallback

## Class signature

```java
public static interface ForgeChunkManager.OrderedLoadingCallback extends ForgeChunkManager.LoadingCallback
```

## Methods

- `java.util.List<ForgeChunkManager.Ticket> ticketsLoaded(java.util.List<ForgeChunkManager.Ticket> tickets, World world, int maxTicketCount)` — Called back when tickets are loaded from the world to allow the mod to decide if it wants the ticket still, and prioritise overflow based on the ticket count.
