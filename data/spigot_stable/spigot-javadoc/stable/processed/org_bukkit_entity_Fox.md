---
title: "org.bukkit.entity.Fox"
package: "org.bukkit.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/entity/Fox.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Fox**
`public interface Fox extends Animals, Sittable`
- `@NotNull Fox.Type getFoxType()`
- `void setFoxType(@NotNull Fox.Type type)`
- `boolean isCrouching()`
- `void setCrouching(boolean crouching)`
- `void setSleeping(boolean sleeping)`
- `@Nullable AnimalTamer getFirstTrustedPlayer()`
- `void setFirstTrustedPlayer(@Nullable AnimalTamer player)`
- `@Nullable AnimalTamer getSecondTrustedPlayer()`
- `void setSecondTrustedPlayer(@Nullable AnimalTamer player)`
- `boolean isFaceplanted()`
