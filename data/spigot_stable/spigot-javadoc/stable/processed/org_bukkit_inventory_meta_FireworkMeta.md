---
title: "org.bukkit.inventory.meta.FireworkMeta"
package: "org.bukkit.inventory.meta"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/meta/FireworkMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface FireworkMeta**
`public interface FireworkMeta extends ItemMeta`
- `void addEffect(@NotNull FireworkEffect effect) throws IllegalArgumentException`
- `void addEffects(@NotNull FireworkEffect... effects) throws IllegalArgumentException`
- `void addEffects(@NotNull Iterable<FireworkEffect> effects) throws IllegalArgumentException`
- `@NotNull List<FireworkEffect> getEffects()`
- `int getEffectsSize()`
- `void removeEffect(int index) throws IndexOutOfBoundsException`
- `void clearEffects()`
- `boolean hasEffects()`
- `boolean hasPower()`
- `int getPower()`
- `void setPower(int power) throws IllegalArgumentException`
- `@NotNull FireworkMeta clone()`
