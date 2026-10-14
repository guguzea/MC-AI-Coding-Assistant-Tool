---
title: "org.bukkit.entity.Fox"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/Fox.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Fox**
`public interface Fox extends Animals, Sittable`
- `@NotNull @NotNull Fox.Type getFoxType()`
- `void setFoxType(@NotNull @NotNull Fox.Type type)`
- `boolean isCrouching()`
- `void setCrouching(boolean crouching)`
- `void setSleeping(boolean sleeping)`
- `@Nullable @Nullable AnimalTamer getFirstTrustedPlayer()`
- `void setFirstTrustedPlayer(@Nullable @Nullable AnimalTamer player)`
- `@Nullable @Nullable AnimalTamer getSecondTrustedPlayer()`
- `void setSecondTrustedPlayer(@Nullable @Nullable AnimalTamer player)`
- `boolean isFaceplanted()`
- `void setInterested(boolean interested)`
- `boolean isInterested()`
- `void setLeaping(boolean leaping)`
- `boolean isLeaping()`
- `void setDefending(boolean defending)`
- `boolean isDefending()`
- `void setFaceplanted(boolean faceplanted)`
