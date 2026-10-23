---
title: "org.bukkit.entity.EntityType"
package: "org.bukkit.entity"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public final class org.bukkit.entity.EntityType extends java.lang.Enum<org.bukkit.entity.EntityType> implements org.bukkit.Keyed, org.bukkit.Translatable, org.bukkit.registry.RegistryAware`
- 枚举常量：`ITEM` · `EXPERIENCE_ORB` · `AREA_EFFECT_CLOUD` · `ELDER_GUARDIAN` · `WITHER_SKELETON` · `STRAY` · `EGG` · `LEASH_KNOT` · `PAINTING` · `ARROW` · `SNOWBALL` · `FIREBALL` · `SMALL_FIREBALL` · `ENDER_PEARL` · `EYE_OF_ENDER` · `POTION` · `EXPERIENCE_BOTTLE` · `ITEM_FRAME` · `WITHER_SKULL` · `TNT` · `FALLING_BLOCK` · `FIREWORK_ROCKET` · `HUSK` · `SPECTRAL_ARROW` · `SHULKER_BULLET` · `DRAGON_FIREBALL` · `ZOMBIE_VILLAGER` · `SKELETON_HORSE` · `ZOMBIE_HORSE` · `ARMOR_STAND` · `DONKEY` · `MULE` · `EVOKER_FANGS` · `EVOKER` · `VEX` · `VINDICATOR` · `ILLUSIONER` · `COMMAND_BLOCK_MINECART` · `MINECART` · `CHEST_MINECART` · `FURNACE_MINECART` · `TNT_MINECART` · `HOPPER_MINECART` · `SPAWNER_MINECART` · `CREEPER` · `SKELETON` · `SPIDER` · `GIANT` · `ZOMBIE` · `SLIME` · `GHAST` · `ZOMBIFIED_PIGLIN` · `ENDERMAN` · `CAVE_SPIDER` · `SILVERFISH` · `BLAZE` · `MAGMA_CUBE` · `ENDER_DRAGON` · `WITHER` · `BAT` · `WITCH` · `ENDERMITE` · `GUARDIAN` · `SHULKER` · `PIG` · `SHEEP` · `COW` · `CHICKEN` · `SQUID` · `WOLF` · `MOOSHROOM` · `SNOW_GOLEM` · `OCELOT` · `IRON_GOLEM` · `HORSE` · `RABBIT` · `POLAR_BEAR` · `LLAMA` · `LLAMA_SPIT` · `PARROT` · `VILLAGER` · `END_CRYSTAL` · `TURTLE` · `PHANTOM` · `TRIDENT` · `COD` · `SALMON` · `PUFFERFISH` · `TROPICAL_FISH` · `DROWNED` · `DOLPHIN` · `CAT` · `PANDA` · `PILLAGER` · `RAVAGER` · `TRADER_LLAMA` · `WANDERING_TRADER` · `FOX` · `BEE` · `HOGLIN` · `PIGLIN` · `STRIDER` · `ZOGLIN` · `PIGLIN_BRUTE` · `AXOLOTL` · `GLOW_ITEM_FRAME` · `GLOW_SQUID` · `GOAT` · `MARKER` · `ALLAY` · `FROG` · `TADPOLE` · `WARDEN` · `CAMEL` · `BLOCK_DISPLAY` · `INTERACTION` · `ITEM_DISPLAY` · `SNIFFER` · `TEXT_DISPLAY` · `BREEZE` · `WIND_CHARGE` · `BREEZE_WIND_CHARGE` · `ARMADILLO` · `BOGGED` · `OMINOUS_ITEM_SPAWNER` · `ACACIA_BOAT` · `ACACIA_CHEST_BOAT` · `BAMBOO_RAFT` · `BAMBOO_CHEST_RAFT` · `BIRCH_BOAT` · `BIRCH_CHEST_BOAT` · `CHERRY_BOAT` · `CHERRY_CHEST_BOAT` · `DARK_OAK_BOAT` · `DARK_OAK_CHEST_BOAT` · `JUNGLE_BOAT` · `JUNGLE_CHEST_BOAT` · `MANGROVE_BOAT` · `MANGROVE_CHEST_BOAT` · `OAK_BOAT` · `OAK_CHEST_BOAT` · `PALE_OAK_BOAT` · `PALE_OAK_CHEST_BOAT` · `SPRUCE_BOAT` · `SPRUCE_CHEST_BOAT` · `CREAKING` · `FISHING_BOBBER` · `LIGHTNING_BOLT` · `PLAYER` · `UNKNOWN`
- `public static org.bukkit.entity.EntityType[] values()`
- `public static org.bukkit.entity.EntityType valueOf(java.lang.String)`
- `public java.lang.String getName()`
- `public org.bukkit.NamespacedKey getKey()`
- `public java.lang.Class<? extends org.bukkit.entity.Entity> getEntityClass()`
- `public short getTypeId()`
- `public static org.bukkit.entity.EntityType fromName(java.lang.String)`
- `public static org.bukkit.entity.EntityType fromId(int)`
- `public boolean isSpawnable()`
- `public boolean isAlive()`
- `public java.lang.String getTranslationKey()`
- `public boolean isEnabledByFeature(org.bukkit.World)`
- `public org.bukkit.NamespacedKey getKeyOrThrow()`
- `public org.bukkit.NamespacedKey getKeyOrNull()`
- `public boolean isRegistered()`
