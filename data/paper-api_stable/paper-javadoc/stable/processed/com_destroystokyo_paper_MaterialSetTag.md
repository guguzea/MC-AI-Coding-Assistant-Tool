---
title: "com.destroystokyo.paper.MaterialSetTag"
package: "com.destroystokyo.paper"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/MaterialSetTag.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class MaterialSetTag**
`public class MaterialSetTag extends BaseTag<Material, MaterialSetTag>`
- `@Deprecated public MaterialSetTag(@NotNull @NotNull Predicate<Material> filter)`
- `@Deprecated public MaterialSetTag(@NotNull @NotNull Collection<Material> materials)`
- `@Deprecated public MaterialSetTag(@NotNull @NotNull Material... materials)`
- `public MaterialSetTag(@Nullable @Nullable NamespacedKey key, @NotNull @NotNull Predicate<Material> filter)`
- `public MaterialSetTag(@Nullable @Nullable NamespacedKey key, @NotNull @NotNull Material... materials)`
- `public MaterialSetTag(@Nullable @Nullable NamespacedKey key, @NotNull @NotNull Collection<Material> materials)`
- `public MaterialSetTag(@Nullable @Nullable NamespacedKey key, @NotNull @NotNull Collection<Material> materials, @NotNull @NotNull Predicate<Material>... globalPredicates)`
- `@NotNull @Internal protected @NotNull Set<Material> getAllPossibleValues()`
- `@NotNull @Internal protected @NotNull String getName(@NotNull @NotNull Material value)`
- `public boolean isTagged(@NotNull @NotNull BlockData block)`
- `public boolean isTagged(@NotNull @NotNull BlockState block)`
- `public boolean isTagged(@NotNull @NotNull Block block)`
- `public boolean isTagged(@NotNull @NotNull ItemStack item)`
- `public boolean isTagged(@NotNull @NotNull Material material)`
