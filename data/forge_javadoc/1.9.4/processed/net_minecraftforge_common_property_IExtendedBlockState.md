# IExtendedBlockState

## Class signature

```java
public interface IExtendedBlockState extends IBlockState
```

## Methods

- `IBlockState getClean()`
- `java.util.Collection<IUnlistedProperty<?>> getUnlistedNames()`
- `com.google.common.collect.ImmutableMap<IUnlistedProperty<?>, com.google.common.base.Optional<?>> getUnlistedProperties()`
- `<V> V getValue(IUnlistedProperty<V> property)`
- `<V> IExtendedBlockState withProperty(IUnlistedProperty<V> property, V value)`