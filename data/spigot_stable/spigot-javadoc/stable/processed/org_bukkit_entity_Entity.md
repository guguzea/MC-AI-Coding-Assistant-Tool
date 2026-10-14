---
title: "org.bukkit.entity.Entity"
package: "org.bukkit.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/entity/Entity.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Entity**
`public interface Entity extends Metadatable, CommandSender, Nameable, PersistentDataHolder`
- `@NotNull Location getLocation()`
- `@Contract("null -> null; !null -> !null") @Nullable Location getLocation(@Nullable Location loc)`
- `void setVelocity(@NotNull Vector velocity)`
- `@NotNull Vector getVelocity()`
- `double getHeight()`
- `double getWidth()`
- `@NotNull BoundingBox getBoundingBox()`
- `boolean isOnGround()`
- `boolean isInWater()`
- `@NotNull World getWorld()`
- `void setRotation(float yaw, float pitch)`
- `boolean teleport(@NotNull Location location)`
- `boolean teleport(@NotNull Location location, @NotNull PlayerTeleportEvent.TeleportCause cause)`
- `boolean teleport(@NotNull Entity destination)`
- `boolean teleport(@NotNull Entity destination, @NotNull PlayerTeleportEvent.TeleportCause cause)`
- `@NotNull List<Entity> getNearbyEntities(double x, double y, double z)`
- `int getEntityId()`
- `int getFireTicks()`
- `int getMaxFireTicks()`
- `void setFireTicks(int ticks)`
- `void setVisualFire(boolean fire)`
- `boolean isVisualFire()`
- `int getFreezeTicks()`
- `int getMaxFreezeTicks()`
- `void setFreezeTicks(int ticks)`
- `boolean isFrozen()`
- `void remove()`
- `boolean isDead()`
- `boolean isValid()`
- `@NotNull Server getServer()`
- `boolean isPersistent()`
- `void setPersistent(boolean persistent)`
- `@Deprecated(since="1.11.2") @Nullable Entity getPassenger()`
- `@Deprecated(since="1.11.2") boolean setPassenger(@NotNull Entity passenger)`
- `@NotNull List<Entity> getPassengers()`
- `boolean addPassenger(@NotNull Entity passenger)`
- `boolean removePassenger(@NotNull Entity passenger)`
- `boolean isEmpty()`
- `boolean eject()`
- `float getFallDistance()`
- `void setFallDistance(float distance)`
- `@Deprecated(since="1.20.4", forRemoval=true) void setLastDamageCause(@Nullable EntityDamageEvent event)`
- `@Nullable EntityDamageEvent getLastDamageCause()`
- `@NotNull UUID getUniqueId()`
- `int getTicksLived()`
- `void setTicksLived(int value)`
- `void playEffect(@NotNull EntityEffect type)`
- `@NotNull EntityType getType()`
- `@NotNull Sound getSwimSound()`
- `@NotNull Sound getSwimSplashSound()`
- `@NotNull Sound getSwimHighSpeedSplashSound()`
- `boolean isInsideVehicle()`
- `boolean leaveVehicle()`
- `@Nullable Entity getVehicle()`
- `void setCustomNameVisible(boolean flag)`
- `boolean isCustomNameVisible()`
- `void setVisibleByDefault(boolean visible)`
- `boolean isVisibleByDefault()`
- `@NotNull Set<Player> getTrackedBy()`
- `void setGlowing(boolean flag)`
- `boolean isGlowing()`
- `void setInvulnerable(boolean flag)`
- `boolean isInvulnerable()`
- `boolean isSilent()`
- `void setSilent(boolean flag)`
- `boolean hasGravity()`
- `void setGravity(boolean gravity)`
- `int getPortalCooldown()`
- `void setPortalCooldown(int cooldown)`
- `@NotNull Set<String> getScoreboardTags()`
- `boolean addScoreboardTag(@NotNull String tag)`
- `boolean removeScoreboardTag(@NotNull String tag)`
- `@NotNull PistonMoveReaction getPistonMoveReaction()`
- `@NotNull BlockFace getFacing()`
- `@NotNull Pose getPose()`
- `@NotNull SpawnCategory getSpawnCategory()`
- `boolean isInWorld()`
- `@Nullable @Experimental String getAsString()`
- `@Nullable @Experimental EntitySnapshot createSnapshot()`
- `@NotNull @Experimental Entity copy()`
- `@NotNull @Experimental Entity copy(@NotNull Location to)`
- `@NotNull Entity.Spigot spigot()`
