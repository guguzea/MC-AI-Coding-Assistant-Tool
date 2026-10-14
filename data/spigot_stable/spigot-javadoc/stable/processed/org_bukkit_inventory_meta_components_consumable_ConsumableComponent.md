---
title: "org.bukkit.inventory.meta.components.consumable.ConsumableComponent"
package: "org.bukkit.inventory.meta.components.consumable"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/meta/components/consumable/ConsumableComponent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface ConsumableComponent**
`@Experimental public interface ConsumableComponent extends ConfigurationSerializable`
- `float getConsumeSeconds()`
- `void setConsumeSeconds(float consumeSeconds)`
- `@NotNull ConsumableComponent.Animation getAnimation()`
- `void setAnimation(@NotNull ConsumableComponent.Animation animation)`
- `@Nullable Sound getSound()`
- `void setSound(@Nullable Sound sound)`
- `boolean hasConsumeParticles()`
- `void setConsumeParticles(boolean consumeParticles)`
- `@NotNull List<ConsumableEffect> getEffects()`
- `void setEffects(@NotNull List<ConsumableEffect> effects)`
- `@NotNull ConsumableEffect addEffect(@NotNull ConsumableEffect effect)`
