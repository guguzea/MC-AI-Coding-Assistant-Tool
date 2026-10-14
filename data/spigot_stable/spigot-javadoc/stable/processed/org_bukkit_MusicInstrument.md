---
title: "org.bukkit.MusicInstrument"
package: "org.bukkit"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/MusicInstrument.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class MusicInstrument**
`public abstract class MusicInstrument extends Object implements Keyed, RegistryAware`
- `public static final MusicInstrument PONDER_GOAT_HORN`
- `public static final MusicInstrument SING_GOAT_HORN`
- `public static final MusicInstrument SEEK_GOAT_HORN`
- `public static final MusicInstrument FEEL_GOAT_HORN`
- `public static final MusicInstrument ADMIRE_GOAT_HORN`
- `public static final MusicInstrument CALL_GOAT_HORN`
- `public static final MusicInstrument YEARN_GOAT_HORN`
- `public static final MusicInstrument DREAM_GOAT_HORN`
- `public MusicInstrument()`
- `public abstract float getDuration()`
- `public abstract float getRange()`
- `@NotNull public abstract String getDescription()`
- `@NotNull public abstract Sound getSoundEvent()`
- `@NotNull @Deprecated(since="1.21.4") public abstract NamespacedKey getKey()`
- `@Nullable @Deprecated(since="1.20.1") public static MusicInstrument getByKey(@NotNull NamespacedKey namespacedKey)`
- `@NotNull @Deprecated(since="1.20.1") public static Collection<MusicInstrument> values()`
