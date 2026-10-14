---
title: "org.bukkit.structure.StructureManager"
package: "org.bukkit.structure"
source: https://jd.papermc.io/paper/26.3/org/bukkit/structure/StructureManager.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface StructureManager**
`public interface StructureManager`
- `@NotNull @NotNull Map<NamespacedKey, Structure> getStructures()`
- `@Nullable @Nullable Structure getStructure(@NotNull @NotNull NamespacedKey structureKey)`
- `@Nullable @Nullable Structure registerStructure(@NotNull @NotNull NamespacedKey structureKey, @NotNull @NotNull Structure structure)`
- `@Nullable @Nullable Structure unregisterStructure(@NotNull @NotNull NamespacedKey structureKey)`
- `@Nullable @Nullable Structure loadStructure(@NotNull @NotNull NamespacedKey structureKey, boolean register)`
- `@Nullable @Nullable Structure loadStructure(@NotNull @NotNull NamespacedKey structureKey)`
- `void saveStructure(@NotNull @NotNull NamespacedKey structureKey)`
- `void saveStructure(@NotNull @NotNull NamespacedKey structureKey, @NotNull @NotNull Structure structure) throws IOException`
- `void deleteStructure(@NotNull @NotNull NamespacedKey structureKey) throws IOException`
- `void deleteStructure(@NotNull @NotNull NamespacedKey structureKey, boolean unregister) throws IOException`
- `@NotNull @NotNull File getStructureFile(@NotNull @NotNull NamespacedKey structureKey)`
- `@NotNull @NotNull Structure loadStructure(@NotNull @NotNull File file) throws IOException`
- `@NotNull @NotNull Structure loadStructure(@NotNull @NotNull InputStream inputStream) throws IOException`
- `void saveStructure(@NotNull @NotNull File file, @NotNull @NotNull Structure structure) throws IOException`
- `void saveStructure(@NotNull @NotNull OutputStream outputStream, @NotNull @NotNull Structure structure) throws IOException`
- `@NotNull @NotNull Structure createStructure()`
- `@NotNull @NotNull Structure copy(@NotNull @NotNull Structure structure)`
