---
title: "io.papermc.paper.util.TransformingRandomAccessList"
package: "io.papermc.paper.util"
source: https://jd.papermc.io/paper/1.20.1/io/papermc/paper/util/TransformingRandomAccessList.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public TransformingRandomAccessList(@NonNull List<F> fromList, @NonNull Function<? super F,? extends T> toFunction, @NonNull Function<? super T,? extends F> fromFunction)`
- `public void clear()`
- `public T get(int index)`
- `@NotNull public @NotNull Iterator<T> iterator()`
- `@NotNull public @NotNull ListIterator<T> listIterator(int index)`
- `public boolean isEmpty()`
- `public boolean removeIf(Predicate<? super T> filter)`
- `public T remove(int index)`
- `public int size()`
- `public T set(int i, T t)`
- `public void add(int i, T t)`
