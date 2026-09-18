# IBlockStatePalette

## Class signature

```java
public interface IBlockStatePalette
```

## Methods

- `int idFor( IBlockState state)`
- `@Nullable IBlockState getBlockState(int indexKey)`
- `void read( PacketBuffer buf)`
- `void write( PacketBuffer buf)`
- `int getSerializedState()`