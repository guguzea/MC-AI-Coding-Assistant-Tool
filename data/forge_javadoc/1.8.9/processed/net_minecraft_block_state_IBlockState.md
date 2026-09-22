# IBlockState

## Class signature

```java
public interface IBlockState
```

## Methods

- `<T extends java.lang.Comparable<T>> IBlockState cycleProperty(IProperty<T> property)`
- `Block getBlock()`
- `<any> getProperties()`
- `java.util.Collection<IProperty> getPropertyNames()`
- `<T extends java.lang.Comparable<T>> T getValue(IProperty<T> property)`
- `<T extends java.lang.Comparable<T>, V extends T> IBlockState withProperty(IProperty<T> property, V value)`