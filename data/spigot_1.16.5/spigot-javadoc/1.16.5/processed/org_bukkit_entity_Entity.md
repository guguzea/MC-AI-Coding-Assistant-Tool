---
title: "org.bukkit.entity.Entity"
package: "org.bukkit.entity"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
---

- `public interface org.bukkit.entity.Entity extends org.bukkit.metadata.Metadatable,org.bukkit.command.CommandSender,org.bukkit.Nameable,org.bukkit.persistence.PersistentDataHolder`
- `public abstract org.bukkit.Location getLocation()`
- `public abstract org.bukkit.Location getLocation(org.bukkit.Location)`
- `public abstract void setVelocity(org.bukkit.util.Vector)`
- `public abstract org.bukkit.util.Vector getVelocity()`
- `public abstract double getHeight()`
- `public abstract double getWidth()`
- `public abstract org.bukkit.util.BoundingBox getBoundingBox()`
- `public abstract boolean isOnGround()`
- `public abstract boolean isInWater()`
- `public abstract org.bukkit.World getWorld()`
- `public abstract void setRotation(float, float)`
- `public abstract boolean teleport(org.bukkit.Location)`
- `public abstract boolean teleport(org.bukkit.Location, org.bukkit.event.player.PlayerTeleportEvent$TeleportCause)`
- `public abstract boolean teleport(org.bukkit.entity.Entity)`
- `public abstract boolean teleport(org.bukkit.entity.Entity, org.bukkit.event.player.PlayerTeleportEvent$TeleportCause)`
- `public abstract java.util.List<org.bukkit.entity.Entity> getNearbyEntities(double, double, double)`
- `public abstract int getEntityId()`
- `public abstract int getFireTicks()`
- `public abstract int getMaxFireTicks()`
- `public abstract void setFireTicks(int)`
- `public abstract void remove()`
- `public abstract boolean isDead()`
- `public abstract boolean isValid()`
- `public abstract org.bukkit.Server getServer()`
- `public abstract boolean isPersistent()`
- `public abstract void setPersistent(boolean)`
- `public abstract org.bukkit.entity.Entity getPassenger()`
- `public abstract boolean setPassenger(org.bukkit.entity.Entity)`
- `public abstract java.util.List<org.bukkit.entity.Entity> getPassengers()`
- `public abstract boolean addPassenger(org.bukkit.entity.Entity)`
- `public abstract boolean removePassenger(org.bukkit.entity.Entity)`
- `public abstract boolean isEmpty()`
- `public abstract boolean eject()`
- `public abstract float getFallDistance()`
- `public abstract void setFallDistance(float)`
- `public abstract void setLastDamageCause(org.bukkit.event.entity.EntityDamageEvent)`
- `public abstract org.bukkit.event.entity.EntityDamageEvent getLastDamageCause()`
- `public abstract java.util.UUID getUniqueId()`
- `public abstract int getTicksLived()`
- `public abstract void setTicksLived(int)`
- `public abstract void playEffect(org.bukkit.EntityEffect)`
- `public abstract org.bukkit.entity.EntityType getType()`
- `public abstract boolean isInsideVehicle()`
- `public abstract boolean leaveVehicle()`
- `public abstract org.bukkit.entity.Entity getVehicle()`
- `public abstract void setCustomNameVisible(boolean)`
- `public abstract boolean isCustomNameVisible()`
- `public abstract void setGlowing(boolean)`
- `public abstract boolean isGlowing()`
- `public abstract void setInvulnerable(boolean)`
- `public abstract boolean isInvulnerable()`
- `public abstract boolean isSilent()`
- `public abstract void setSilent(boolean)`
- `public abstract boolean hasGravity()`
- `public abstract void setGravity(boolean)`
- `public abstract int getPortalCooldown()`
- `public abstract void setPortalCooldown(int)`
- `public abstract java.util.Set<java.lang.String> getScoreboardTags()`
- `public abstract boolean addScoreboardTag(java.lang.String)`
- `public abstract boolean removeScoreboardTag(java.lang.String)`
- `public abstract org.bukkit.block.PistonMoveReaction getPistonMoveReaction()`
- `public abstract org.bukkit.block.BlockFace getFacing()`
- `public abstract org.bukkit.entity.Pose getPose()`
- `public abstract org.bukkit.entity.Entity$Spigot spigot()`
- `public default org.bukkit.command.CommandSender$Spigot spigot()`
