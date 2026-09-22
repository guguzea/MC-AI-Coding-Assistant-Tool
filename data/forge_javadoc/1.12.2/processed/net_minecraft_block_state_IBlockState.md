# IBlockState

## Class signature

```java
public interface IBlockState extends IBlockBehaviors, IBlockProperties
```

## Methods

- `<T extends java.lang.Comparable<T>> IBlockState cycleProperty(IProperty<T> property)`
- `Block getBlock()`
- `<any> getProperties()`
- `java.util.Collection<IProperty<?>> getPropertyKeys()`
- `<T extends java.lang.Comparable<T>> T getValue(IProperty<T> property)`
- `<T extends java.lang.Comparable<T>, V extends T> IBlockState withProperty(IProperty<T> property, V value)`