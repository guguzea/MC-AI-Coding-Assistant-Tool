---
title: "org.bukkit.structure.StructureManager"
package: "org.bukkit.structure"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/structure/StructureManager.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface StructureManager**
`public interface StructureManager`
- `@NotNull Map<NamespacedKey, Structure> getStructures()`
- `@Nullable Structure getStructure(@NotNull NamespacedKey structureKey)`
- `@Nullable Structure registerStructure(@NotNull NamespacedKey structureKey, @NotNull Structure structure)`
- `@Nullable Structure unregisterStructure(@NotNull NamespacedKey structureKey)`
- `@Nullable Structure loadStructure(@NotNull NamespacedKey structureKey, boolean register)`
- `@Nullable Structure loadStructure(@NotNull NamespacedKey structureKey)`
- `void saveStructure(@NotNull NamespacedKey structureKey)`
- `void saveStructure(@NotNull NamespacedKey structureKey, @NotNull Structure structure) throws IOException`
- `void deleteStructure(@NotNull NamespacedKey structureKey) throws IOException`
- `void deleteStructure(@NotNull NamespacedKey structureKey, boolean unregister) throws IOException`
- `@NotNull File getStructureFile(@NotNull NamespacedKey structureKey)`
- `@NotNull Structure loadStructure(@NotNull File file) throws IOException`
- `@NotNull Structure loadStructure(@NotNull InputStream inputStream) throws IOException`
- `void saveStructure(@NotNull File file, @NotNull Structure structure) throws IOException`
- `void saveStructure(@NotNull OutputStream outputStream, @NotNull Structure structure) throws IOException`
- `@NotNull Structure createStructure()`
- `@NotNull Structure copy(@NotNull Structure structure)`
