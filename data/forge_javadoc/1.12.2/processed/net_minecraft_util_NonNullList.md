# NonNullList

## Class signature

```java
public class NonNullList<E> extends java.util.AbstractList<E>
```

## Constructors

- `protected NonNullList()`
- `protected NonNullList(java.util.List< E > delegateIn, E listType)`

## Methods

- `public static <E> NonNullList <E> create()`
- `public static <E> NonNullList <E> withSize(int size, E fill)`
- `public static <E> NonNullList <E> from(E defaultElementIn, E... elements)`
- `public E get(int p_get_1_)`
- `public E set(int p_set_1_, E p_set_2_)`
- `public void add(int p_add_1_, E p_add_2_)`
- `public E remove(int p_remove_1_)`
- `public int size()`
- `public void clear()`