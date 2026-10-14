---
title: "org.bukkit.Art"
package: "org.bukkit"
source: https://jd.papermc.io/paper/26.3/org/bukkit/Art.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Art**
`public interface Art extends OldEnum<Art>, Keyed`
- `static final Art ALBAN`
- `static final Art AZTEC`
- `static final Art AZTEC2`
- `static final Art BACKYARD`
- `static final Art BAROQUE`
- `static final Art BOMB`
- `static final Art BOUQUET`
- `static final Art BURNING_SKULL`
- `static final Art BUST`
- `static final Art CAVEBIRD`
- `static final Art CHANGING`
- `static final Art COTAN`
- `static final Art COURBET`
- `static final Art CREEBET`
- `static final Art DENNIS`
- `static final Art DONKEY_KONG`
- `static final Art EARTH`
- `static final Art ENDBOSS`
- `static final Art FERN`
- `static final Art FIGHTERS`
- `static final Art FINDING`
- `static final Art FIRE`
- `static final Art GRAHAM`
- `static final Art HUMBLE`
- `static final Art KEBAB`
- `static final Art LOWMIST`
- `static final Art MATCH`
- `static final Art MEDITATIVE`
- `static final Art ORB`
- `static final Art OWLEMONS`
- `static final Art PASSAGE`
- `static final Art PIGSCENE`
- `static final Art PLANT`
- `static final Art POINTER`
- `static final Art POND`
- `static final Art POOL`
- `static final Art PRAIRIE_RIDE`
- `static final Art SEA`
- `static final Art SKELETON`
- `static final Art SKULL_AND_ROSES`
- `static final Art STAGE`
- `static final Art SUNFLOWERS`
- `static final Art SUNSET`
- `static final Art TIDES`
- `static final Art UNPACKED`
- `static final Art VOID`
- `static final Art WANDERER`
- `static final Art WASTELAND`
- `static final Art WATER`
- `static final Art WIND`
- `static final Art WITHER`
- `int getBlockWidth()`
- `int getBlockHeight()`
- `@Deprecated(since="1.6.2", forRemoval=true) int getId()`
- `@Deprecated(since="1.21", forRemoval=true) @NotNull @NotNull NamespacedKey getKey()`
- `@Deprecated(since="1.21", forRemoval=true) default @NotNull Key key()`
- `@Nullable Component title()`
- `@Nullable Component author()`
- `@NotNull Key assetId()`
- `@Deprecated(since="1.6.2", forRemoval=true) @Nullable static @Nullable Art getById(int id)`
- `@Deprecated(since="1.21.3") @Nullable static @Nullable Art getByName(@NotNull @NotNull String name)`
- `@NotNull @Deprecated(since="1.21.3", forRemoval=true) @ScheduledForRemoval(inVersion="1.22") static @NotNull Art valueOf(@NotNull @NotNull String name)`
- `@NotNull @Deprecated(since="1.21.3", forRemoval=true) @ScheduledForRemoval(inVersion="1.22") static @NotNull Art[] values()`
