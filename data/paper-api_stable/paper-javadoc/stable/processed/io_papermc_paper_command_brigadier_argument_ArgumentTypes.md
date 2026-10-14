---
title: "io.papermc.paper.command.brigadier.argument.ArgumentTypes"
package: "io.papermc.paper.command.brigadier.argument"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/command/brigadier/argument/ArgumentTypes.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class ArgumentTypes**
`public final class ArgumentTypes extends Object`
- `public static com.mojang.brigadier.arguments.ArgumentType<EntitySelectorArgumentResolver> entity()`
- `public static com.mojang.brigadier.arguments.ArgumentType<EntitySelectorArgumentResolver> entities()`
- `public static com.mojang.brigadier.arguments.ArgumentType<PlayerSelectorArgumentResolver> player()`
- `public static com.mojang.brigadier.arguments.ArgumentType<PlayerSelectorArgumentResolver> players()`
- `public static com.mojang.brigadier.arguments.ArgumentType<PlayerProfileListResolver> playerProfiles()`
- `public static com.mojang.brigadier.arguments.ArgumentType<BlockPositionResolver> blockPosition()`
- `@Experimental public static com.mojang.brigadier.arguments.ArgumentType<ColumnBlockPositionResolver> columnBlockPosition()`
- `@Experimental public static com.mojang.brigadier.arguments.ArgumentType<BlockInWorldPredicate> blockInWorldPredicate()`
- `public static com.mojang.brigadier.arguments.ArgumentType<FinePositionResolver> finePosition()`
- `public static com.mojang.brigadier.arguments.ArgumentType<FinePositionResolver> finePosition(boolean centerIntegers)`
- `@Experimental public static com.mojang.brigadier.arguments.ArgumentType<ColumnFinePositionResolver> columnFinePosition()`
- `@Experimental public static com.mojang.brigadier.arguments.ArgumentType<ColumnFinePositionResolver> columnFinePosition(boolean centerIntegers)`
- `public static com.mojang.brigadier.arguments.ArgumentType<RotationResolver> rotation()`
- `@Experimental public static com.mojang.brigadier.arguments.ArgumentType<AngleResolver> angle()`
- `@Experimental public static com.mojang.brigadier.arguments.ArgumentType<AxisSet> axes()`
- `public static com.mojang.brigadier.arguments.ArgumentType<BlockState> blockState()`
- `public static com.mojang.brigadier.arguments.ArgumentType<ItemStack> itemStack()`
- `public static com.mojang.brigadier.arguments.ArgumentType<ItemStackPredicate> itemPredicate()`
- `public static com.mojang.brigadier.arguments.ArgumentType<NamedTextColor> namedColor()`
- `public static com.mojang.brigadier.arguments.ArgumentType<TextColor> hexColor()`
- `public static com.mojang.brigadier.arguments.ArgumentType<Component> component()`
- `public static com.mojang.brigadier.arguments.ArgumentType<Style> style()`
- `public static com.mojang.brigadier.arguments.ArgumentType<SignedMessageResolver> signedMessage()`
- `public static com.mojang.brigadier.arguments.ArgumentType<DisplaySlot> scoreboardDisplaySlot()`
- `public static com.mojang.brigadier.arguments.ArgumentType<NamespacedKey> namespacedKey()`
- `public static com.mojang.brigadier.arguments.ArgumentType<Key> key()`
- `public static com.mojang.brigadier.arguments.ArgumentType<IntegerRangeProvider> integerRange()`
- `public static com.mojang.brigadier.arguments.ArgumentType<DoubleRangeProvider> doubleRange()`
- `public static com.mojang.brigadier.arguments.ArgumentType<World> world()`
- `public static com.mojang.brigadier.arguments.ArgumentType<GameMode> gameMode()`
- `public static com.mojang.brigadier.arguments.ArgumentType<HeightMap> heightMap()`
- `public static com.mojang.brigadier.arguments.ArgumentType<UUID> uuid()`
- `public static com.mojang.brigadier.arguments.ArgumentType<Criteria> objectiveCriteria()`
- `public static com.mojang.brigadier.arguments.ArgumentType<LookAnchor> entityAnchor()`
- `public static com.mojang.brigadier.arguments.ArgumentType<Integer> time()`
- `public static com.mojang.brigadier.arguments.ArgumentType<Integer> time(int mintime)`
- `public static com.mojang.brigadier.arguments.ArgumentType<Mirror> templateMirror()`
- `public static com.mojang.brigadier.arguments.ArgumentType<StructureRotation> templateRotation()`
- `public static <T> com.mojang.brigadier.arguments.ArgumentType<T> resource(RegistryKey<T> registryKey)`
- `public static <T> com.mojang.brigadier.arguments.ArgumentType<TypedKey<T>> resourceKey(RegistryKey<T> registryKey)`
