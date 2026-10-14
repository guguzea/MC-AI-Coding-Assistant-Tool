---
title: "org.bukkit.entity.Wither"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/Wither.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Wither**
`public interface Wither extends Monster, Boss, RangedEntity`
- `void setTarget(@Nullable @Nullable LivingEntity target)`
- `void setTarget(@NotNull @NotNull Wither.Head head, @Nullable @Nullable LivingEntity target)`
- `@Nullable @Nullable LivingEntity getTarget(@NotNull @NotNull Wither.Head head)`
- `@Deprecated(forRemoval=true) int getInvulnerabilityTicks()`
- `@Deprecated(forRemoval=true) void setInvulnerabilityTicks(int ticks)`
- `boolean isCharged()`
- `int getInvulnerableTicks()`
- `void setInvulnerableTicks(int ticks)`
- `boolean canTravelThroughPortals()`
- `void setCanTravelThroughPortals(boolean value)`
- `void enterInvulnerabilityPhase()`
