---
title: "org.bukkit.structure.StructureManager"
package: "org.bukkit.structure"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
---

- `public interface org.bukkit.structure.StructureManager`
- `public abstract java.util.Map<org.bukkit.NamespacedKey, org.bukkit.structure.Structure> getStructures()`
- `public abstract org.bukkit.structure.Structure getStructure(org.bukkit.NamespacedKey)`
- `public abstract org.bukkit.structure.Structure registerStructure(org.bukkit.NamespacedKey, org.bukkit.structure.Structure)`
- `public abstract org.bukkit.structure.Structure unregisterStructure(org.bukkit.NamespacedKey)`
- `public abstract org.bukkit.structure.Structure loadStructure(org.bukkit.NamespacedKey, boolean)`
- `public abstract org.bukkit.structure.Structure loadStructure(org.bukkit.NamespacedKey)`
- `public abstract void saveStructure(org.bukkit.NamespacedKey)`
- `public abstract void saveStructure(org.bukkit.NamespacedKey, org.bukkit.structure.Structure) throws java.io.IOException`
- `public abstract void deleteStructure(org.bukkit.NamespacedKey) throws java.io.IOException`
- `public abstract void deleteStructure(org.bukkit.NamespacedKey, boolean) throws java.io.IOException`
- `public abstract java.io.File getStructureFile(org.bukkit.NamespacedKey)`
- `public abstract org.bukkit.structure.Structure loadStructure(java.io.File) throws java.io.IOException`
- `public abstract org.bukkit.structure.Structure loadStructure(java.io.InputStream) throws java.io.IOException`
- `public abstract void saveStructure(java.io.File, org.bukkit.structure.Structure) throws java.io.IOException`
- `public abstract void saveStructure(java.io.OutputStream, org.bukkit.structure.Structure) throws java.io.IOException`
- `public abstract org.bukkit.structure.Structure createStructure()`
- `public abstract org.bukkit.structure.Structure copy(org.bukkit.structure.Structure)`
