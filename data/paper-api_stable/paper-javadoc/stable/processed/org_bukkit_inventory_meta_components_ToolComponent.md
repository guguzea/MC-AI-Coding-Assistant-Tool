---
title: "org.bukkit.inventory.meta.components.ToolComponent"
package: "org.bukkit.inventory.meta.components"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/meta/components/ToolComponent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ToolComponent**
`@Experimental public interface ToolComponent extends ConfigurationSerializable`
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
