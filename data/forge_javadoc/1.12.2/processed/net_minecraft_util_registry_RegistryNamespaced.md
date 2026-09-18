# RegistryNamespaced

## Class signature

```java
public class RegistryNamespaced<K,V> extends RegistrySimple <K,V> implements IObjectIntIterable <V>
```

## Constructors

- `public RegistryNamespaced()`

## Methods

- `public void register(int id, K key, V value)`
- `protected java.util.Map< K , V > createUnderlyingMap()`
- `public V getObject( K name)`
- `public K getNameForObject( V value)`
- `public boolean containsKey( K key)`
- `public int getIDForObject( V value)`
- `public V getObjectById(int id)`
- `public java.util.Iterator< V > iterator()`