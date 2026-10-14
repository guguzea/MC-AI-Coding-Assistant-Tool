---
title: "org.bukkit.inventory.meta.components.ToolComponent"
package: "org.bukkit.inventory.meta.components"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/meta/components/ToolComponent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface ToolComponent**
`@Experimental public interface ToolComponent extends ConfigurationSerializable`
- `float getDefaultMiningSpeed()`
- `void setDefaultMiningSpeed(float speed)`
- `int getDamagePerBlock()`
- `void setDamagePerBlock(int damage)`
- `boolean canDestroyBlocksInCreative()`
- `void setCanDestroyBlocksInCreative(boolean destroy)`
- `@NotNull List<ToolComponent.ToolRule> getRules()`
- `void setRules(@NotNull List<ToolComponent.ToolRule> rules)`
- `@NotNull ToolComponent.ToolRule addRule(@NotNull Material block, @Nullable Float speed, @Nullable Boolean correctForDrops)`
- `@NotNull ToolComponent.ToolRule addRule(@NotNull Collection<Material> blocks, @Nullable Float speed, @Nullable Boolean correctForDrops)`
- `@NotNull ToolComponent.ToolRule addRule(@NotNull Tag<Material> tag, @Nullable Float speed, @Nullable Boolean correctForDrops)`
- `boolean removeRule(@NotNull ToolComponent.ToolRule rule)`
