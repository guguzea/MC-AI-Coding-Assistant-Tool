---
title: "io.papermc.paper.util.TransformingRandomAccessList"
package: "io.papermc.paper.util"
source: https://jd.papermc.io/paper/1.21.1/io/papermc/paper/util/TransformingRandomAccessList.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `public TransformingRandomAccessList(List<F> fromList, Function<? super F,? extends T> toFunction, Function<? super T,? extends F> fromFunction)`
- `public void clear()`
- `public T get(int index)`
- `public Iterator<T> iterator()`
- `public ListIterator<T> listIterator(int index)`
- `public boolean isEmpty()`
- `public boolean removeIf(Predicate<? super T> filter)`
- `public T remove(int index)`
- `public int size()`
- `public T set(int i, T t)`
- `public void add(int i, T t)`
