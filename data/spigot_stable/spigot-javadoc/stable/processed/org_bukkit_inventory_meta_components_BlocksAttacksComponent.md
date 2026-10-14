---
title: "org.bukkit.inventory.meta.components.BlocksAttacksComponent"
package: "org.bukkit.inventory.meta.components"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/meta/components/BlocksAttacksComponent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface BlocksAttacksComponent**
`@Experimental public interface BlocksAttacksComponent extends ConfigurationSerializable`
- `float getBlockDelaySeconds()`
- `void setBlockDelaySeconds(float seconds)`
- `float getDisableCooldownScale()`
- `void setDisableCooldownScale(float scale)`
- `@NotNull List<BlocksAttacksComponent.DamageReduction> getDamageReductions()`
- `void setDamageReductions(@NotNull List<BlocksAttacksComponent.DamageReduction> reductions)`
- `@NotNull BlocksAttacksComponent.DamageReduction addDamageReduction(@NotNull DamageType type, float base, float factor, float horizontalBlockingAngle)`
- `@NotNull BlocksAttacksComponent.DamageReduction addDamageReduction(@NotNull Collection<DamageType> types, float base, float factor, float horizontalBlockingAngle)`
- `@NotNull BlocksAttacksComponent.DamageReduction addDamageReduction(@NotNull Tag<DamageType> tag, float base, float factor, float horizontalBlockingAngle)`
- `boolean removeDamageReduction(@NotNull BlocksAttacksComponent.DamageReduction reduction)`
- `float getItemDamageThreshold()`
- `void setItemDamageThreshold(float threshold)`
- `float getItemDamageBase()`
- `void setItemDamageBase(float base)`
- `float getItemDamageFactor()`
- `void setItemDamageFactor(float factor)`
- `@Nullable Sound getBlockSound()`
- `void setBlockSound(@Nullable Sound sound)`
- `@Nullable Sound getDisableSound()`
- `void setDisableSound(@Nullable Sound sound)`
- `@Nullable @Deprecated(since="26.1") Tag<DamageType> getBypassedBy()`
- `@Nullable Collection<DamageType> getBypassedBys()`
- `void setBypassedBy(@Nullable Tag<DamageType> tag)`
- `void setBypassedBy(@Nullable Collection<DamageType> damages)`
