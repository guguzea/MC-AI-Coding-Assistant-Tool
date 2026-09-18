# CollectionWrapperFactory

## Class signature

```java
public class CollectionWrapperFactory extends java.lang.Object
```

## Constructors

- `public CollectionWrapperFactory()`

## Methods

- `public static <T> java.util.Collection<T> wrap(java.util.Collection coll, java.lang.Class<T> elementType)`
- `public static <T> java.util.List<T> wrap(java.util.List list, java.lang.Class<T> elementType)`

## Description

Return a read only cast view of the supplied ungeneric collection, based on the element type given