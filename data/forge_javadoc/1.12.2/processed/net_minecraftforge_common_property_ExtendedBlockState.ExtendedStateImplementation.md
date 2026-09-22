# ExtendedBlockState.ExtendedStateImplementation

**Inheritance:** java.lang.Object → net.minecraft.block.state.BlockStateBase → net.minecraft.block.state.BlockStateContainer.StateImplementation → net.minecraftforge.common.property.ExtendedBlockState.ExtendedStateImplementation

## Class signature

```java
protected static class ExtendedBlockState.ExtendedStateImplementation extends BlockStateContainer.StateImplementation implements IExtendedBlockState
```

## Methods

- `IBlockState getClean()`
- `java.util.Collection<IUnlistedProperty<?>> getUnlistedNames()`
- `<any> getUnlistedProperties()`
- `<V> V getValue(IUnlistedProperty<V> property)`
- `<T extends java.lang.Comparable<T>, V extends T> IBlockState withProperty(IProperty<T> property, V value)`
- `<V> IExtendedBlockState withProperty(IUnlistedProperty<V> property, V value)`

## Fields

- `protected ExtendedStateImplementation`