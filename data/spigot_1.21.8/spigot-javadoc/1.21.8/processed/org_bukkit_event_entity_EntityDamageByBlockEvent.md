---
title: "org.bukkit.event.entity.EntityDamageByBlockEvent"
package: "org.bukkit.event.entity"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public class org.bukkit.event.entity.EntityDamageByBlockEvent extends org.bukkit.event.entity.EntityDamageEvent`
- `public org.bukkit.event.entity.EntityDamageByBlockEvent(org.bukkit.block.Block, org.bukkit.entity.Entity, org.bukkit.event.entity.EntityDamageEvent$DamageCause, double)`
- `public org.bukkit.event.entity.EntityDamageByBlockEvent(org.bukkit.block.Block, org.bukkit.block.BlockState, org.bukkit.entity.Entity, org.bukkit.event.entity.EntityDamageEvent$DamageCause, org.bukkit.damage.DamageSource, double)`
- `public org.bukkit.event.entity.EntityDamageByBlockEvent(org.bukkit.block.Block, org.bukkit.entity.Entity, org.bukkit.event.entity.EntityDamageEvent$DamageCause, java.util.Map<org.bukkit.event.entity.EntityDamageEvent$DamageModifier, java.lang.Double>, java.util.Map<org.bukkit.event.entity.EntityDamageEvent$DamageModifier, ? extends com.google.common.base.Function<? super java.lang.Double, java.lang.Double>>)`
- `public org.bukkit.event.entity.EntityDamageByBlockEvent(org.bukkit.block.Block, org.bukkit.block.BlockState, org.bukkit.entity.Entity, org.bukkit.event.entity.EntityDamageEvent$DamageCause, org.bukkit.damage.DamageSource, java.util.Map<org.bukkit.event.entity.EntityDamageEvent$DamageModifier, java.lang.Double>, java.util.Map<org.bukkit.event.entity.EntityDamageEvent$DamageModifier, ? extends com.google.common.base.Function<? super java.lang.Double, java.lang.Double>>)`
- `public org.bukkit.block.Block getDamager()`
- `public org.bukkit.block.BlockState getDamagerBlockState()`
