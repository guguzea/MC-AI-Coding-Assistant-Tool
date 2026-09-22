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