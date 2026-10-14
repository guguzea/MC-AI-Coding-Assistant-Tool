---
title: "org.bukkit.inventory.meta.components.ToolComponent.ToolRule"
package: "org.bukkit.inventory.meta.components"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/meta/components/ToolComponent.ToolRule.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface ToolComponent.ToolRule**
`public static interface ToolComponent.ToolRule extends ConfigurationSerializable`
- `@NotNull Collection<Material> getBlocks()`
- `void setBlocks(@NotNull Material block)`
- `void setBlocks(@NotNull Collection<Material> blocks)`
- `void setBlocks(@NotNull Tag<Material> tag)`
- `@Nullable Float getSpeed()`
- `void setSpeed(@Nullable Float speed)`
- `@Nullable Boolean isCorrectForDrops()`
- `void setCorrectForDrops(@Nullable Boolean correct)`
