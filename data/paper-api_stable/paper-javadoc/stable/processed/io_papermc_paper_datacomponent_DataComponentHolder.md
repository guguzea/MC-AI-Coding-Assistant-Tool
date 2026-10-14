---
title: "io.papermc.paper.datacomponent.DataComponentHolder"
package: "io.papermc.paper.datacomponent"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/DataComponentHolder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface DataComponentHolder**
`@NullMarked @NonExtendable public interface DataComponentHolder extends DataComponentView`
- `<T> void setData(DataComponentType.Valued<T> type, DataComponentBuilder<T> valueBuilder)`
- `<T> void setData(DataComponentType.Valued<T> type, T value)`
- `void setData(DataComponentType.NonValued type)`
