---
title: "io.papermc.paper.datacomponent.DataComponentView"
package: "io.papermc.paper.datacomponent"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/DataComponentView.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface DataComponentView**
`@NullMarked @NonExtendable public interface DataComponentView`
- `@Contract(pure=true) <T> @Nullable T getData(DataComponentType.Valued<T> type)`
- `@Contract(value="_, !null -> !null", pure=true) <T> @Nullable T getDataOrDefault(DataComponentType.Valued<? extends T> type, @Nullable T fallback)`
- `@Contract(pure=true) boolean hasData(DataComponentType type)`
