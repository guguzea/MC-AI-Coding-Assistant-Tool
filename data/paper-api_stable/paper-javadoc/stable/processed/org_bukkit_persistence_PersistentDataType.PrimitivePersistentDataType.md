---
title: "org.bukkit.persistence.PersistentDataType.PrimitivePersistentDataType"
package: "org.bukkit.persistence"
source: https://jd.papermc.io/paper/26.3/org/bukkit/persistence/PersistentDataType.PrimitivePersistentDataType.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PersistentDataType.PrimitivePersistentDataType<P>**
`public static class PersistentDataType.PrimitivePersistentDataType<P> extends Object implements PersistentDataType<P,P>`
- `@NotNull public @NotNull Class<P> getPrimitiveType()`
- `@NotNull public @NotNull Class<P> getComplexType()`
- `@NotNull public P toPrimitive(@NotNull P complex, @NotNull @NotNull PersistentDataAdapterContext context)`
- `@NotNull public P fromPrimitive(@NotNull P primitive, @NotNull @NotNull PersistentDataAdapterContext context)`
