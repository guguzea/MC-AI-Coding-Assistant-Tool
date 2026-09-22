# IRegistry

## Class signature

```java
public interface IRegistry<K, V> extends java.lang.Iterable<V>
```

## Methods

- `java.util.Set<K> getKeys()`
- `V getObject(K name)`
- `void putObject(K key, V value)`