# RegistryNamespacedDefaultedByKey

## Class signature

```java
public class RegistryNamespacedDefaultedByKey<K,V> extends RegistryNamespaced <K,V>
```

## Constructors

- `public RegistryNamespacedDefaultedByKey( K defaultValueKeyIn)`

## Methods

- `public void register(int id, K key, V value)`
- `public void validateKey()`
- `public int getIDForObject( V value)`
- `@Nonnull public K getNameForObject( V value)`
- `@Nonnull public V getObject(@Nullable K name)`
- `@Nonnull public V getObjectById(int id)`
- `@Nonnull public V getRandomObject(java.util.Random random)`
- `public int getIDForObjectBypass( V bypass)`
- `public K getNameForObjectBypass( V value)`
- `public V getObjectBypass( K name)`
- `public V getObjectByIdBypass(int id)`