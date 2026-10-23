---
title: "org.bukkit.entity.Entity"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/entity/Entity.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `static class Entity.Spigot`
- `boolean addPassenger(Entity passenger)`
- `boolean addScoreboardTag(String tag)`
- `boolean eject()`
- `boolean fromMobSpawner()`
- `Chunk getChunk()`
- `int getEntityId()`
- `float getFallDistance()`
- `int getFireTicks()`
- `double getHeight()`
- `EntityDamageEvent getLastDamageCause()`
- `Location getLocation()`
- `Location getLocation(Location loc)`
- `int getMaxFireTicks()`
- `List<Entity> getNearbyEntities(double x, double y, double z)`
- `Location getOrigin()`
- `Entity getPassenger()`
- `List<Entity> getPassengers()`
- `PistonMoveReaction getPistonMoveReaction()`
- `int getPortalCooldown()`
- `Set<String> getScoreboardTags()`
- `Server getServer()`
- `int getTicksLived()`
- `EntityType getType()`
- `UUID getUniqueId()`
- `Entity getVehicle()`
- `Vector getVelocity()`
- `double getWidth()`
- `World getWorld()`
- `boolean hasGravity()`
- `boolean isCustomNameVisible()`
- `boolean isDead()`
- `boolean isEmpty()`
- `boolean isGlowing()`
- `boolean isInsideVehicle()`
- `boolean isInvulnerable()`
- `boolean isOnGround()`
- `boolean isSilent()`
- `boolean isValid()`
- `boolean leaveVehicle()`
- `void playEffect(EntityEffect type)`
- `void remove()`
- `boolean removePassenger(Entity passenger)`
- `boolean removeScoreboardTag(String tag)`
- `void setCustomNameVisible(boolean flag)`
- `void setFallDistance(float distance)`
- `void setFireTicks(int ticks)`
- `void setGlowing(boolean flag)`
- `void setGravity(boolean gravity)`
- `void setInvulnerable(boolean flag)`
- `void setLastDamageCause(EntityDamageEvent event)`
- `boolean setPassenger(Entity passenger)`
- `void setPortalCooldown(int cooldown)`
- `void setSilent(boolean flag)`
- `void setTicksLived(int value)`
- `void setVelocity(Vector velocity)`
- `Entity.Spigot spigot()`
- `boolean teleport(Entity destination)`
- `boolean teleport(Entity destination, PlayerTeleportEvent.TeleportCause cause)`
- `boolean teleport(Location location)`
- `boolean teleport(Location location, PlayerTeleportEvent.TeleportCause cause)`
