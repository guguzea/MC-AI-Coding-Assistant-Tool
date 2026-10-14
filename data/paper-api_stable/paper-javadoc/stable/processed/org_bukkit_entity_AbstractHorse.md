---
title: "org.bukkit.entity.AbstractHorse"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/AbstractHorse.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface AbstractHorse**
`public interface AbstractHorse extends Vehicle, InventoryHolder, Tameable`
- `@Deprecated(since="1.11", forRemoval=true) @NotNull Horse.Variant getVariant()`
- `@Deprecated(since="1.11", forRemoval=true) @Contract("_ -> fail") void setVariant(Horse.Variant variant)`
- `int getDomestication()`
- `void setDomestication(int level)`
- `int getMaxDomestication()`
- `void setMaxDomestication(int level)`
- `double getJumpStrength()`
- `void setJumpStrength(double strength)`
- `@Deprecated(forRemoval=true) boolean isEatingHaystack()`
- `@Deprecated(forRemoval=true) void setEatingHaystack(boolean eatingHaystack)`
- `@NotNull @NotNull AbstractHorseInventory getInventory()`
- `boolean isEatingGrass()`
- `void setEatingGrass(boolean eating)`
- `boolean isRearing()`
- `void setRearing(boolean rearing)`
- `boolean isEating()`
- `void setEating(boolean eating)`
