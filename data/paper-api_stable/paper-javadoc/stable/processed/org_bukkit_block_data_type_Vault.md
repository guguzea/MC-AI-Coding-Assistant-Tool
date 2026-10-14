---
title: "org.bukkit.block.data.type.Vault"
package: "org.bukkit.block.data.type"
source: https://jd.papermc.io/paper/26.3/org/bukkit/block/data/type/Vault.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Vault**
`public interface Vault extends Directional`
- `@NotNull @NotNull Vault.State getVaultState()`
- `@Deprecated(since="1.21.3", forRemoval=true) @NotNull default @NotNull Vault.State getTrialSpawnerState()`
- `void setVaultState(@NotNull @NotNull Vault.State state)`
- `@Deprecated(since="1.21.3", forRemoval=true) default void setTrialSpawnerState(@NotNull @NotNull Vault.State state)`
- `boolean isOminous()`
- `void setOminous(boolean ominous)`
