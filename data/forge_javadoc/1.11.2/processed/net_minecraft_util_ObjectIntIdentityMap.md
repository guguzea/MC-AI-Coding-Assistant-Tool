# ObjectIntIdentityMap

**Inheritance:** java.lang.Object → net.minecraft.util.ObjectIntIdentityMap<T>

## Class signature

```java
public class ObjectIntIdentityMap<T> extends java.lang.Object implements IObjectIntIterable<T>
```

## Constructors

- `ObjectIntIdentityMap()`
- `ObjectIntIdentityMap(int expectedSize)`

## Methods

- `int get(T key)`
- `T getByValue(int value)`
- `java.util.Iterator<T> iterator()`
- `void put(T key, int value)`
- `int size()`

## Fields

- `protected java.util.IdentityHashMap<T, java.lang.Integer> identityMap`
- `protected java.util.List<T> objectList`