# RegistrySimple

## Class signature

```java
public class RegistrySimple<K,V> extends java.lang.Object implements IRegistry <K,V>
```

## Constructors

- `public RegistrySimple()`

## Methods

- `protected java.util.Map< K , V > createUnderlyingMap()`
- `public V getObject( K name)`
- `public void putObject( K key, V value)`
- `public java.util.Set< K > getKeys()`
- `public boolean containsKey( K p_148741_1_)`
- `public java.util.Iterator< V > iterator()`

## Description

Does this registry contain an entry for the given key?