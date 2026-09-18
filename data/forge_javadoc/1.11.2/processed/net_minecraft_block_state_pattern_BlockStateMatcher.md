# BlockStateMatcher

## Class signature

```java
public class BlockStateMatcher extends java.lang.Object implements com.google.common.base.Predicate< IBlockState >
```

## Methods

- `public static BlockStateMatcher forBlock( Block blockIn)`
- `public boolean apply(@Nullable IBlockState p_apply_1_)`
- `protected <T extends java.lang.Comparable<T>> boolean matches( IBlockState blockState, IProperty <T> property, com.google.common.base.Predicate<T> predicate)`
- `public <V extends java.lang.Comparable<V>> BlockStateMatcher where( IProperty <V> property, com.google.common.base.Predicate<? extends V> is)`