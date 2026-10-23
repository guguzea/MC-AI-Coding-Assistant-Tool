---
title: "org.bukkit.block.Beacon"
package: "org.bukkit.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.12.2-R0.1-SNAPSHOT/spigot-api-1.12.2-R0.1-20180712.012057-156.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:35:10.184Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
jarMd5: "f1c84754979a6e1344a24f09bb1fed35"
---

- `public interface org.bukkit.block.Beacon extends org.bukkit.block.Container,org.bukkit.Nameable`
- `public abstract org.bukkit.inventory.BeaconInventory getInventory()`
- `public abstract org.bukkit.inventory.BeaconInventory getSnapshotInventory()`
- `public abstract java.util.Collection<org.bukkit.entity.LivingEntity> getEntitiesInRange()`
- `public abstract int getTier()`
- `public abstract org.bukkit.potion.PotionEffect getPrimaryEffect()`
- `public abstract void setPrimaryEffect(org.bukkit.potion.PotionEffectType)`
- `public abstract org.bukkit.potion.PotionEffect getSecondaryEffect()`
- `public abstract void setSecondaryEffect(org.bukkit.potion.PotionEffectType)`
