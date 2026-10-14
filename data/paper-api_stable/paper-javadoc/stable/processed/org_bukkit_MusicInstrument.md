---
title: "org.bukkit.MusicInstrument"
package: "org.bukkit"
source: https://jd.papermc.io/paper/26.3/org/bukkit/MusicInstrument.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class MusicInstrument**
`@NullMarked public abstract class MusicInstrument extends Object implements Keyed, Translatable`
- `public static final MusicInstrument ADMIRE_GOAT_HORN`
- `public static final MusicInstrument CALL_GOAT_HORN`
- `public static final MusicInstrument DREAM_GOAT_HORN`
- `public static final MusicInstrument FEEL_GOAT_HORN`
- `public static final MusicInstrument PONDER_GOAT_HORN`
- `public static final MusicInstrument SEEK_GOAT_HORN`
- `public static final MusicInstrument SING_GOAT_HORN`
- `public static final MusicInstrument YEARN_GOAT_HORN`
- `public MusicInstrument()`
- `public static MusicInstrument create(Consumer<RegistryBuilderFactory<MusicInstrument, ? extends InstrumentRegistryEntry.Builder>> value)`
- `@Deprecated(since="1.20.1") public static @Nullable MusicInstrument getByKey(NamespacedKey namespacedKey)`
- `@Deprecated(since="1.20.1") public static Collection<MusicInstrument> values()`
- `public abstract float getDuration()`
- `public abstract float getRange()`
- `public abstract Component description()`
- `public abstract Sound getSound()`
- `@Deprecated(forRemoval=true, since="1.20.5") public abstract NamespacedKey getKey()`
- `@Deprecated(forRemoval=true, since="1.20.5") public @NotNull Key key()`
- `@Deprecated(forRemoval=true) public abstract String translationKey()`
