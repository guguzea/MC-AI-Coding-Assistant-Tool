---
title: "org.bukkit.metadata.MetadataValueAdapter"
package: "org.bukkit.metadata"
source: https://jd.papermc.io/paper/26.3/org/bukkit/metadata/MetadataValueAdapter.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class MetadataValueAdapter**
`@Deprecated public abstract class MetadataValueAdapter extends Object implements MetadataValue`
- `protected final WeakReference<Plugin> owningPlugin`
- `protected MetadataValueAdapter(@NotNull @NotNull Plugin owningPlugin)`
- `@Nullable public @Nullable Plugin getOwningPlugin()`
- `public int asInt()`
- `public float asFloat()`
- `public double asDouble()`
- `public long asLong()`
- `public short asShort()`
- `public byte asByte()`
- `public boolean asBoolean()`
- `@NotNull public @NotNull String asString()`
