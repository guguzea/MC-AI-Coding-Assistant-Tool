# RegistryNamespaced

**Inheritance:** java.lang.Object → net.minecraft.util.RegistrySimple<K, V> → net.minecraft.util.RegistryNamespaced<K, V>

## Class signature

```java
public class RegistryNamespaced<K, V> extends RegistrySimple<K, V> implements IObjectIntIterable<V>
```

## Constructors

- `RegistryNamespaced()`

## Methods

- `boolean containsKey(K p_148741_1_)` — Does this registry contain an entry for the given key?
- `protected java.util.Map<K, V> createUnderlyingMap()`
- `int getIDForObject(V p_148757_1_)` — Gets the integer ID we use to identify the given object.
- `K getNameForObject(V p_177774_1_)` — Gets the name we use to identify the given object.
- `V getObject(K name)`
- `V getObjectById(int id)` — Gets the object identified by the given ID.
- `java.util.Iterator<V> iterator()`
- `void register(int id, K p_177775_2_, V p_177775_3_)`

## Fields

- `protected java.util.Map<V, K> inverseObjectRegistry`
- `protected ObjectIntIdentityMap<V> underlyingIntegerMap`