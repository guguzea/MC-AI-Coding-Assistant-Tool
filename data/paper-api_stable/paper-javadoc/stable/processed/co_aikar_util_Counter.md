---
title: "co.aikar.util.Counter"
package: "co.aikar.util"
source: https://jd.papermc.io/paper/26.3/co/aikar/util/Counter.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class Counter<T>**
`@Deprecated(forRemoval=true) public class Counter<T> extends ForwardingMap<T,Long>`
- `public Counter()`
- `public long decrement(@Nullable T key)`
- `public long increment(@Nullable T key)`
- `public long decrement(@Nullable T key, long amount)`
- `public long increment(@Nullable T key, long amount)`
- `public long getCount(@Nullable T key)`
- `@NotNull protected @NotNull Map<T,Long> delegate()`
