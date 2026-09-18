# BlockStateBase

## Class signature

```java
public abstract class BlockStateBase extends java.lang.Object implements IBlockState
```

## Constructors

- `public BlockStateBase()`

## Methods

- `public <T extends java.lang.Comparable<T>> IBlockState cycleProperty( IProperty <T> property)`
- `protected static <T> T cyclePropertyValue(java.util.Collection<T> values, T currentValue)`
- `public java.lang.String toString()`
- `public com.google.common.collect.ImmutableTable< IProperty <?>,java.lang.Comparable<?>, IBlockState > getPropertyValueTable()`