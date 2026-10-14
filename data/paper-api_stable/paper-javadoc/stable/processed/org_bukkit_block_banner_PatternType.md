---
title: "org.bukkit.block.banner.PatternType"
package: "org.bukkit.block.banner"
source: https://jd.papermc.io/paper/26.3/org/bukkit/block/banner/PatternType.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface PatternType**
`public interface PatternType extends OldEnum<PatternType>, Keyed`
- `static final PatternType BASE`
- `static final PatternType BORDER`
- `static final PatternType BRICKS`
- `static final PatternType CIRCLE`
- `static final PatternType CREEPER`
- `static final PatternType CROSS`
- `static final PatternType CURLY_BORDER`
- `static final PatternType DIAGONAL_LEFT`
- `static final PatternType DIAGONAL_RIGHT`
- `static final PatternType DIAGONAL_UP_LEFT`
- `static final PatternType DIAGONAL_UP_RIGHT`
- `static final PatternType FLOW`
- `static final PatternType FLOWER`
- `static final PatternType GLOBE`
- `static final PatternType GRADIENT`
- `static final PatternType GRADIENT_UP`
- `static final PatternType GUSTER`
- `static final PatternType HALF_HORIZONTAL`
- `static final PatternType HALF_HORIZONTAL_BOTTOM`
- `static final PatternType HALF_VERTICAL`
- `static final PatternType HALF_VERTICAL_RIGHT`
- `static final PatternType MOJANG`
- `static final PatternType PIGLIN`
- `static final PatternType RHOMBUS`
- `static final PatternType SKULL`
- `static final PatternType SMALL_STRIPES`
- `static final PatternType SQUARE_BOTTOM_LEFT`
- `static final PatternType SQUARE_BOTTOM_RIGHT`
- `static final PatternType SQUARE_TOP_LEFT`
- `static final PatternType SQUARE_TOP_RIGHT`
- `static final PatternType STRAIGHT_CROSS`
- `static final PatternType STRIPE_BOTTOM`
- `static final PatternType STRIPE_CENTER`
- `static final PatternType STRIPE_DOWNLEFT`
- `static final PatternType STRIPE_DOWNRIGHT`
- `static final PatternType STRIPE_LEFT`
- `static final PatternType STRIPE_MIDDLE`
- `static final PatternType STRIPE_RIGHT`
- `static final PatternType STRIPE_TOP`
- `static final PatternType TRIANGLE_BOTTOM`
- `static final PatternType TRIANGLE_TOP`
- `static final PatternType TRIANGLES_BOTTOM`
- `static final PatternType TRIANGLES_TOP`
- `@Deprecated(since="1.20.5", forRemoval=true) default @NotNull Key key()`
- `@Deprecated(since="1.20.5", forRemoval=true) @NotNull @NotNull NamespacedKey getKey()`
- `@NotNull @Deprecated(since="1.20.4", forRemoval=true) @NotNull String getIdentifier()`
- `@Contract("null -> null") @Nullable @Deprecated(since="1.20.4", forRemoval=true) static @Nullable PatternType getByIdentifier(@Nullable @Nullable String identifier)`
- `@NotNull @Deprecated(since="1.21", forRemoval=true) @ScheduledForRemoval(inVersion="1.22") static @NotNull PatternType valueOf(@NotNull @NotNull String name)`
- `@NotNull @Deprecated(since="1.21", forRemoval=true) @ScheduledForRemoval(inVersion="1.22") static @NotNull PatternType[] values()`
