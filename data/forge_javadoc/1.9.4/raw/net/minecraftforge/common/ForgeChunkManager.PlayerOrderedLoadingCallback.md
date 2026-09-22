---
title: "ForgeChunkManager.PlayerOrderedLoadingCallback"
description: "public static interface ForgeChunkManager.PlayerOrderedLoadingCallback extends ForgeChunkManager.LoadingCallback"
package: "net/minecraftforge/common"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/common/ForgeChunkManager.PlayerOrderedLoadingCallback.html"
sourceType: javadoc
---

# ForgeChunkManager.PlayerOrderedLoadingCallback

## Class signature

```java
public static interface ForgeChunkManager.PlayerOrderedLoadingCallback extends ForgeChunkManager.LoadingCallback
```

## Methods

- `com.google.common.collect.ListMultimap<java.lang.String, ForgeChunkManager.Ticket> playerTicketsLoaded(com.google.common.collect.ListMultimap<java.lang.String, ForgeChunkManager.Ticket> tickets, World world)` — Called back when tickets are loaded from the world to allow the mod to decide if it wants the ticket still.
