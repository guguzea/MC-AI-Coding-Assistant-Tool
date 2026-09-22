# ContextKeys

**Inheritance:** java.lang.Object → net.minecraftforge.server.permission.context.ContextKeys

## Class signature

```java
public class ContextKeys extends java.lang.Object
```

## Constructors

- `ContextKeys()`

## Fields

- `static ContextKey<AxisAlignedBB> AREA`
- `static ContextKey<IBlockState> BLOCK_STATE`
- `static ContextKey<EnumFacing> FACING`
- `static ContextKey<BlockPos> POS` — BlockPos for interacting, breaking and other permissions
- `static ContextKey<Entity> TARGET` — The entity can be anything that gets interacted with - a sheep when you try to dye it, skeleton that you attack, etc.