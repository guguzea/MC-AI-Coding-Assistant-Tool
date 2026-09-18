# FastTESR

## Class signature

```java
public abstract class FastTESR<T extends TileEntity > extends TileEntitySpecialRenderer <T>
```

## Constructors

- `public FastTESR()`

## Methods

- `public final void renderTileEntityAt( T te, double x, double y, double z, float partialTicks, int destroyStage)`
- `public abstract void renderTileEntityFast( T te, double x, double y, double z, float partialTicks, int destroyStage, VertexBuffer VertexBuffer)`