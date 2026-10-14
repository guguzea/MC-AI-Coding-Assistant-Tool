---
title: "io.papermc.paper.text.Filtered"
package: "io.papermc.paper.text"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/text/Filtered.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Filtered<T>**
`@NullMarked public interface Filtered<T>`
- `@Contract(value="_, _ -> new", pure=true) static <T> Filtered<T> of(T raw, @Nullable T filtered)`
- `@Contract(pure=true) T raw()`
- `@Contract(pure=true) @Nullable T filtered()`
