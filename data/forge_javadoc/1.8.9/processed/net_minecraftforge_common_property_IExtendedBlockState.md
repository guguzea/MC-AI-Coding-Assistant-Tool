# IExtendedBlockState

## Class signature

```java
public interface IExtendedBlockState extends IBlockState
```

## Methods

- `java.util.Collection< IUnlistedProperty <?>> getUnlistedNames()`
- `<V> V getValue( IUnlistedProperty <V> property)`
- `<V> IExtendedBlockState withProperty( IUnlistedProperty <V> property, V value)`
- `<any> getUnlistedProperties()`
- `IBlockState getClean()`