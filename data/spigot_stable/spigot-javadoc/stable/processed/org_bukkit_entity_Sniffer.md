---
title: "org.bukkit.entity.Sniffer"
package: "org.bukkit.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/entity/Sniffer.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Sniffer**
`public interface Sniffer extends Animals`
- `@NotNull Collection<Location> getExploredLocations()`
- `void removeExploredLocation(@NotNull Location location)`
- `void addExploredLocation(@NotNull Location location)`
- `@NotNull Sniffer.State getState()`
- `void setState(@NotNull Sniffer.State state)`
- `@Nullable Location findPossibleDigLocation()`
- `boolean canDig()`
