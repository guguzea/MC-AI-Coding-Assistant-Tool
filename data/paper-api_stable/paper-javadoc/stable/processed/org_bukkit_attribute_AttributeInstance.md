---
title: "org.bukkit.attribute.AttributeInstance"
package: "org.bukkit.attribute"
source: https://jd.papermc.io/paper/26.3/org/bukkit/attribute/AttributeInstance.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface AttributeInstance**
`public interface AttributeInstance`
- `@NotNull @NotNull Attribute getAttribute()`
- `double getBaseValue()`
- `void setBaseValue(double value)`
- `@NotNull @NotNull Collection<AttributeModifier> getModifiers()`
- `@Nullable @Nullable AttributeModifier getModifier(@NotNull Key key)`
- `void removeModifier(@NotNull Key key)`
- `@Deprecated(forRemoval=true, since="1.21") @Nullable @Nullable AttributeModifier getModifier(@NotNull UUID uuid)`
- `@Deprecated(forRemoval=true, since="1.21") void removeModifier(@NotNull UUID uuid)`
- `void addModifier(@NotNull @NotNull AttributeModifier modifier)`
- `void addTransientModifier(@NotNull @NotNull AttributeModifier modifier)`
- `void removeModifier(@NotNull @NotNull AttributeModifier modifier)`
- `double getValue()`
- `@Deprecated(since="26.1") double getDefaultValue()`
