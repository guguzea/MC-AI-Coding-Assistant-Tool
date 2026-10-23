---
title: "org.bukkit.Note"
package: "org.bukkit"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/Note.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `public Note(int note)`
- `public Note(int octave, @NotNull @NotNull Note.Tone tone, boolean sharped)`
- `@NotNull public static @NotNull Note flat(int octave, @NotNull @NotNull Note.Tone tone)`
- `@NotNull public static @NotNull Note sharp(int octave, @NotNull @NotNull Note.Tone tone)`
- `@NotNull public static @NotNull Note natural(int octave, @NotNull @NotNull Note.Tone tone)`
- `@NotNull public @NotNull Note sharped()`
- `@NotNull public @NotNull Note flattened()`
- `@Internal public byte getId()`
- `public int getOctave()`
- `@NotNull public @NotNull Note.Tone getTone()`
- `public boolean isSharped()`
- `public float getPitch()`
- `public int hashCode()`
- `public boolean equals(Object obj)`
- `public String toString()`
