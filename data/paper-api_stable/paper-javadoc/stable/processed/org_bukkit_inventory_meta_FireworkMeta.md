---
title: "org.bukkit.inventory.meta.FireworkMeta"
package: "org.bukkit.inventory.meta"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/meta/FireworkMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface FireworkMeta**
`public interface FireworkMeta extends ItemMeta`
- `void addEffect(@NotNull @NotNull FireworkEffect effect) throws IllegalArgumentException`
- `void addEffects(@NotNull @NotNull FireworkEffect... effects) throws IllegalArgumentException`
- `void addEffects(@NotNull @NotNull Iterable<FireworkEffect> effects) throws IllegalArgumentException`
- `@NotNull @NotNull List<FireworkEffect> getEffects()`
- `int getEffectsSize()`
- `void removeEffect(int index) throws IndexOutOfBoundsException`
- `void clearEffects()`
- `boolean hasEffects()`
- `boolean hasPower()`
- `int getPower()`
- `void setPower(int power) throws IllegalArgumentException`
- `@NotNull @NotNull FireworkMeta clone()`
