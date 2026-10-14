---
title: "org.bukkit.entity.Sniffer"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/Sniffer.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Sniffer**
`public interface Sniffer extends Animals`
- `@NotNull @NotNull Collection<Location> getExploredLocations()`
- `void removeExploredLocation(@NotNull @NotNull Location location)`
- `void addExploredLocation(@NotNull @NotNull Location location)`
- `@NotNull Sniffer.State getState()`
- `void setState(@NotNull Sniffer.State state)`
- `@Nullable @Nullable Location findPossibleDigLocation()`
- `boolean canDig()`
