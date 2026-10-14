---
title: "org.bukkit.persistence.PersistentDataType.BooleanPersistentDataType"
package: "org.bukkit.persistence"
source: https://jd.papermc.io/paper/26.3/org/bukkit/persistence/PersistentDataType.BooleanPersistentDataType.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class PersistentDataType.BooleanPersistentDataType**
`public static class PersistentDataType.BooleanPersistentDataType extends Object implements PersistentDataType<Byte,Boolean>`
- `public BooleanPersistentDataType()`
- `@NotNull public @NotNull Class<Byte> getPrimitiveType()`
- `@NotNull public @NotNull Class<Boolean> getComplexType()`
- `@NotNull public @NotNull Byte toPrimitive(@NotNull @NotNull Boolean complex, @NotNull @NotNull PersistentDataAdapterContext context)`
- `@NotNull public @NotNull Boolean fromPrimitive(@NotNull @NotNull Byte primitive, @NotNull @NotNull PersistentDataAdapterContext context)`
