# RegistryNamespacedDefaultedByKey

**Inheritance:** java.lang.Object → net.minecraft.util.registry.RegistrySimple<K, V> → net.minecraft.util.registry.RegistryNamespaced<K, V> → net.minecraft.util.registry.RegistryNamespacedDefaultedByKey<K, V>

## Class signature

```java
public class RegistryNamespacedDefaultedByKey<K, V> extends RegistryNamespaced<K, V>
```

## Methods

- `int getIDForObject(V value)`
- `K getNameForObject(V value)`
- `V getObject(K name)`
- `V getObjectById(int id)`
- `V getRandomObject(java.util.Random random)`
- `void register(int id, K key, V value)`
- `void validateKey()`

## Fields

- `RegistryNamespacedDefaultedByKey`