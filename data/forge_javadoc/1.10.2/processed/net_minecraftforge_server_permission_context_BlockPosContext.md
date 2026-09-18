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