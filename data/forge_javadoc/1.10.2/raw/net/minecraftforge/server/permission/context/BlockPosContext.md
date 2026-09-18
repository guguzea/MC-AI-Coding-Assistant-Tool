---
title: "BlockPosContext"
description: "public class BlockPosContext extends PlayerContext"
package: "net/minecraftforge/server/permission/context"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/server/permission/context/BlockPosContext.html"
sourceType: javadoc
---

# BlockPosContext

## Class signature

```java
public class BlockPosContext extends PlayerContext
```

## Constructors

- `public BlockPosContext( EntityPlayer ep, BlockPos pos, @Nullable IBlockState state, @Nullable EnumFacing f)`
- `public BlockPosContext( EntityPlayer ep, ChunkPos pos)`

## Methods

- `@Nullable public <T> T get( ContextKey <T> key)`
- `protected boolean covers( ContextKey <?> key)`
