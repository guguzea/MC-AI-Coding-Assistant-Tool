---
title: "BlockPosContext"
description: "public class BlockPosContext extends PlayerContext"
package: "net/minecraftforge/server/permission/context"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/server/permission/context/BlockPosContext.html"
sourceType: javadoc
---

# BlockPosContext

**Inheritance:** java.lang.Object → net.minecraftforge.server.permission.context.Context → net.minecraftforge.server.permission.context.PlayerContext → net.minecraftforge.server.permission.context.BlockPosContext

## Class signature

```java
public class BlockPosContext extends PlayerContext
```

## Constructors

- `BlockPosContext(EntityPlayer ep, BlockPos pos, IBlockState state, EnumFacing f)`
- `BlockPosContext(EntityPlayer ep, ChunkPos pos)`

## Methods

- `protected boolean covers(ContextKey<?> key)`
- `<T> T get(ContextKey<T> key)`
