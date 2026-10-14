---
title: "org.bukkit.Note"
package: "org.bukkit"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/Note.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class Note**
`public class Note extends Object`
- `public Note(int note)`
- `public Note(int octave, @NotNull Note.Tone tone, boolean sharped)`
- `@NotNull public static Note flat(int octave, @NotNull Note.Tone tone)`
- `@NotNull public static Note sharp(int octave, @NotNull Note.Tone tone)`
- `@NotNull public static Note natural(int octave, @NotNull Note.Tone tone)`
- `@NotNull public Note sharped()`
- `@NotNull public Note flattened()`
- `@Deprecated(since="1.6.2") public byte getId()`
- `public int getOctave()`
- `@NotNull public Note.Tone getTone()`
- `public boolean isSharped()`
- `public float getPitch()`
- `public int hashCode()`
- `public boolean equals(Object obj)`
- `public String toString()`
