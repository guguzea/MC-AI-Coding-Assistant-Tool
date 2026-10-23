---
title: "io.papermc.paper.util.TransformingRandomAccessList"
package: "io.papermc.paper.util"
source: https://jd.papermc.io/paper/1.16.5/io/papermc/paper/util/TransformingRandomAccessList.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public TransformingRandomAccessList&#8203;(@NonNull List<F> fromList, @NonNull Function<? super F,&#8203;? extends T> toFunction, @NonNull Function<? super T,&#8203;? extends F> fromFunction)`
- `public void clear()`
- `public T get&#8203;(int index)`
- `@NotNull public @NotNull Iterator<T> iterator()`
- `@NotNull public @NotNull ListIterator<T> listIterator&#8203;(int index)`
- `public boolean isEmpty()`
- `public boolean removeIf&#8203;(Predicate<? super T> filter)`
- `public T remove&#8203;(int index)`
- `public int size()`
- `public T set&#8203;(int i, T t)`
- `public void add&#8203;(int i, T t)`
