# ExtendedBlockState.ExtendedStateImplementation

**Inheritance:** java.lang.Object → net.minecraft.block.state.BlockStateBase → net.minecraft.block.state.BlockState.StateImplementation → net.minecraftforge.common.property.ExtendedBlockState.ExtendedStateImplementation

## Class signature

```java
protected static class ExtendedBlockState.ExtendedStateImplementation extends BlockState.StateImplementation implements IExtendedBlockState
```

## Methods

- `void buildPropertyValueTable(java.util.Map<java.util.Map<IProperty, java.lang.Comparable>, BlockState.StateImplementation> map)`
- `IBlockState getClean()`
- `java.util.Collection<IUnlistedProperty<?>> getUnlistedNames()`
- `<any> getUnlistedProperties()`
- `<V> V getValue(IUnlistedProperty<V> property)`
- `<T extends java.lang.Comparable<T>, V extends T> IBlockState withProperty(IProperty<T> property, V value)`
- `<V> IExtendedBlockState withProperty(IUnlistedProperty<V> property, V value)`

## Fields

- `protected ExtendedStateImplementation`