---
title: "org.bukkit.inventory.meta.components.ToolComponent.ToolRule"
package: "org.bukkit.inventory.meta.components"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/meta/components/ToolComponent.ToolRule.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ToolComponent.ToolRule**
`public static interface ToolComponent.ToolRule extends ConfigurationSerializable`
- `@NotNull @NotNull Collection<Material> getBlocks()`
- `void setBlocks(@NotNull @NotNull Material block)`
- `void setBlocks(@NotNull @NotNull Collection<Material> blocks)`
- `void setBlocks(@NotNull @NotNull Tag<Material> tag)`
- `@Nullable @Nullable Float getSpeed()`
- `void setSpeed(@Nullable @Nullable Float speed)`
- `@Nullable @Nullable Boolean isCorrectForDrops()`
- `void setCorrectForDrops(@Nullable @Nullable Boolean correct)`
