---
title: "org.bukkit.inventory.meta.components.ToolComponent"
package: "org.bukkit.inventory.meta.components"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/inventory/meta/components/ToolComponent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `float getDefaultMiningSpeed()`
- `void setDefaultMiningSpeed(float speed)`
- `int getDamagePerBlock()`
- `void setDamagePerBlock(int damage)`
- `@NotNull @NotNull List<ToolComponent.ToolRule> getRules()`
- `void setRules(@NotNull @NotNull List<ToolComponent.ToolRule> rules)`
- `@NotNull @NotNull ToolComponent.ToolRule addRule(@NotNull @NotNull Material block, @Nullable @Nullable Float speed, @Nullable @Nullable Boolean correctForDrops)`
- `@NotNull @NotNull ToolComponent.ToolRule addRule(@NotNull @NotNull Collection<Material> blocks, @Nullable @Nullable Float speed, @Nullable @Nullable Boolean correctForDrops)`
- `@NotNull @NotNull ToolComponent.ToolRule addRule(@NotNull @NotNull Tag<Material> tag, @Nullable @Nullable Float speed, @Nullable @Nullable Boolean correctForDrops)`
- `boolean removeRule(@NotNull @NotNull ToolComponent.ToolRule rule)`
