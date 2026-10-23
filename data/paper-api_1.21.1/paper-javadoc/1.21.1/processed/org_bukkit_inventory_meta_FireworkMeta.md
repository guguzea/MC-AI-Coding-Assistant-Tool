---
title: "org.bukkit.inventory.meta.FireworkMeta"
package: "org.bukkit.inventory.meta"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/inventory/meta/FireworkMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

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
