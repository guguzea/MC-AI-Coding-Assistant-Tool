---
title: "org.bukkit.entity.Animals"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/Animals.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Animals**
`public interface Animals extends Breedable`
- `@Nullable @Nullable UUID getBreedCause()`
- `void setBreedCause(@Nullable @Nullable UUID uuid)`
- `boolean isLoveMode()`
- `int getLoveModeTicks()`
- `void setLoveModeTicks(int ticks)`
- `boolean isBreedItem(@NotNull @NotNull ItemStack stack)`
- `boolean isBreedItem(@NotNull @NotNull Material material)`
