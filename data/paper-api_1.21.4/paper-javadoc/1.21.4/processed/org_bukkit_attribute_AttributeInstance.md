---
title: "org.bukkit.attribute.AttributeInstance"
package: "org.bukkit.attribute"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/attribute/AttributeInstance.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

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
- `double getDefaultValue()`
