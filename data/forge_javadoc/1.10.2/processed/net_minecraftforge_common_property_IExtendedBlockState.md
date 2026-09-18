# IExtendedBlockState

## Class signature

```java
public interface IExtendedBlockState extends IBlockState
```

## Methods

- `java.util.Collection< IUnlistedProperty <?>> getUnlistedNames()`
- `<V> V getValue( IUnlistedProperty <V> property)`
- `<V> IExtendedBlockState withProperty( IUnlistedProperty <V> property, V value)`
- `com.google.common.collect.ImmutableMap< IUnlistedProperty <?>,com.google.common.base.Optional<?>> getUnlistedProperties()`
- `IBlockState getClean()`