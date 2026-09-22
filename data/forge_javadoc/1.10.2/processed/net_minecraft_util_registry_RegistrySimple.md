# RegistrySimple

**Inheritance:** java.lang.Object → net.minecraft.util.registry.RegistrySimple<K, V>

## Class signature

```java
public class RegistrySimple<K, V> extends java.lang.Object implements IRegistry<K, V>
```

## Constructors

- `RegistrySimple()`

## Methods

- `boolean containsKey(K key)`
- `protected java.util.Map<K, V> createUnderlyingMap()`
- `java.util.Set<K> getKeys()`
- `V getObject(K name)`
- `V getRandomObject(java.util.Random random)`
- `java.util.Iterator<V> iterator()`
- `void putObject(K key, V value)`

## Fields

- `protected java.util.Map<K, V> registryObjects`