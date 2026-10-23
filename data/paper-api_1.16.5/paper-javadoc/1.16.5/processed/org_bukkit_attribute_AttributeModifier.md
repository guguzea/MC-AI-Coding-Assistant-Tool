---
title: "org.bukkit.attribute.AttributeModifier"
package: "org.bukkit.attribute"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/attribute/AttributeModifier.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public AttributeModifier&#8203;(@NotNull @NotNull String name, double amount, @NotNull @NotNull AttributeModifier.Operation operation)`
- `public AttributeModifier&#8203;(@NotNull @NotNull UUID uuid, @NotNull @NotNull String name, double amount, @NotNull @NotNull AttributeModifier.Operation operation)`
- `public AttributeModifier&#8203;(@NotNull @NotNull UUID uuid, @NotNull @NotNull String name, double amount, @NotNull @NotNull AttributeModifier.Operation operation, @Nullable @Nullable EquipmentSlot slot)`
- `@NotNull public @NotNull UUID getUniqueId()`
- `@NotNull public @NotNull String getName()`
- `public double getAmount()`
- `@NotNull public @NotNull AttributeModifier.Operation getOperation()`
- `@Nullable public @Nullable EquipmentSlot getSlot()`
- `@NotNull public @NotNull Map<String,&#8203;Object> serialize()`
- `public boolean equals&#8203;(Object other)`
- `public int hashCode()`
- `public String toString()`
- `@NotNull public static @NotNull AttributeModifier deserialize&#8203;(@NotNull @NotNull Map<String,&#8203;Object> args)`
