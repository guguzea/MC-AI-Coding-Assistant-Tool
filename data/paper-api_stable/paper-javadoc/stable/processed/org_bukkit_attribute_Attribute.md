---
title: "org.bukkit.attribute.Attribute"
package: "org.bukkit.attribute"
source: https://jd.papermc.io/paper/26.3/org/bukkit/attribute/Attribute.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Attribute**
`public interface Attribute extends OldEnum<Attribute>, Keyed, Translatable, Translatable`
- `static final Attribute MAX_HEALTH`
- `static final Attribute FOLLOW_RANGE`
- `static final Attribute KNOCKBACK_RESISTANCE`
- `static final Attribute MOVEMENT_SPEED`
- `static final Attribute FLYING_SPEED`
- `static final Attribute ATTACK_DAMAGE`
- `static final Attribute ATTACK_KNOCKBACK`
- `static final Attribute ATTACK_SPEED`
- `static final Attribute ARMOR`
- `static final Attribute ARMOR_TOUGHNESS`
- `static final Attribute FALL_DAMAGE_MULTIPLIER`
- `static final Attribute LUCK`
- `static final Attribute MAX_ABSORPTION`
- `static final Attribute SAFE_FALL_DISTANCE`
- `static final Attribute SCALE`
- `static final Attribute STEP_HEIGHT`
- `static final Attribute GRAVITY`
- `static final Attribute JUMP_STRENGTH`
- `static final Attribute BURNING_TIME`
- `static final Attribute CAMERA_DISTANCE`
- `static final Attribute EXPLOSION_KNOCKBACK_RESISTANCE`
- `static final Attribute MOVEMENT_EFFICIENCY`
- `static final Attribute OXYGEN_BONUS`
- `static final Attribute WATER_MOVEMENT_EFFICIENCY`
- `static final Attribute TEMPT_RANGE`
- `static final Attribute BLOCK_INTERACTION_RANGE`
- `static final Attribute ENTITY_INTERACTION_RANGE`
- `static final Attribute BLOCK_BREAK_SPEED`
- `static final Attribute MINING_EFFICIENCY`
- `static final Attribute SNEAKING_SPEED`
- `static final Attribute SUBMERGED_MINING_SPEED`
- `static final Attribute SWEEPING_DAMAGE_RATIO`
- `static final Attribute SPAWN_REINFORCEMENTS`
- `static final Attribute WAYPOINT_TRANSMIT_RANGE`
- `static final Attribute WAYPOINT_RECEIVE_RANGE`
- `static final Attribute AIR_DRAG_MODIFIER`
- `static final Attribute FRICTION_MODIFIER`
- `static final Attribute BOUNCINESS`
- `static final Attribute BELOW_NAME_DISTANCE`
- `static final Attribute NAME_TAG_DISTANCE`
- `@NotNull @NotNull Attribute.Sentiment getSentiment()`
- `double getDefaultValue()`
- `@NotNull @Deprecated(since="1.21.3", forRemoval=true) @ScheduledForRemoval(inVersion="1.22") static @NotNull Attribute valueOf(@NotNull @NotNull String name)`
- `@NotNull @Deprecated(since="1.21.3", forRemoval=true) @ScheduledForRemoval(inVersion="1.22") static @NotNull Attribute[] values()`
