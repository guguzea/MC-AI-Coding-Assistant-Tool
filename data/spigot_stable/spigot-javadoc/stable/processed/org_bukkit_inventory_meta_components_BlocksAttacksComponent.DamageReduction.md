---
title: "org.bukkit.inventory.meta.components.BlocksAttacksComponent.DamageReduction"
package: "org.bukkit.inventory.meta.components"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/meta/components/BlocksAttacksComponent.DamageReduction.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface BlocksAttacksComponent.DamageReduction**
`public static interface BlocksAttacksComponent.DamageReduction extends ConfigurationSerializable`
- `@Nullable Collection<DamageType> getTypes()`
- `void setTypes(@Nullable DamageType type)`
- `void setTypes(@Nullable Collection<DamageType> types)`
- `void setTypes(@Nullable Tag<DamageType> tag)`
- `float getBase()`
- `void setBase(float base)`
- `float getFactor()`
- `void setFactor(float factor)`
- `float getHorizontalBlockingAngle()`
- `void setHorizontalBlockingAngle(float horizontalBlockingAngle)`
