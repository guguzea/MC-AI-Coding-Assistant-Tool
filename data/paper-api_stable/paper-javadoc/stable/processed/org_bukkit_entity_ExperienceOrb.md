---
title: "org.bukkit.entity.ExperienceOrb"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/ExperienceOrb.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ExperienceOrb**
`public interface ExperienceOrb extends Entity`
- `int getExperience()`
- `void setExperience(int value)`
- `int getCount()`
- `void setCount(int count)`
- `@Deprecated default boolean isFromBottle()`
- `@Nullable UUID getTriggerEntityId()`
- `@Nullable UUID getSourceEntityId()`
- `@NotNull @NotNull ExperienceOrb.SpawnReason getSpawnReason()`
