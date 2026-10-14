---
title: "org.bukkit.attribute.AttributeModifier"
package: "org.bukkit.attribute"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/attribute/AttributeModifier.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class AttributeModifier**
`public class AttributeModifier extends Object implements ConfigurationSerializable, Keyed`
- `@Deprecated(since="1.21", forRemoval=true) public AttributeModifier(@NotNull String name, double amount, @NotNull AttributeModifier.Operation operation)`
- `@Deprecated(since="1.21", forRemoval=true) public AttributeModifier(@NotNull UUID uuid, @NotNull String name, double amount, @NotNull AttributeModifier.Operation operation)`
- `@Deprecated(since="1.21", forRemoval=true) public AttributeModifier(@NotNull UUID uuid, @NotNull String name, double amount, @NotNull AttributeModifier.Operation operation, @Nullable EquipmentSlot slot)`
- `@Deprecated(since="1.21", forRemoval=true) public AttributeModifier(@NotNull UUID uuid, @NotNull String name, double amount, @NotNull AttributeModifier.Operation operation, @NotNull EquipmentSlotGroup slot)`
- `public AttributeModifier(@NotNull NamespacedKey key, double amount, @NotNull AttributeModifier.Operation operation, @NotNull EquipmentSlotGroup slot)`
- `@NotNull @Deprecated(since="1.21", forRemoval=true) public UUID getUniqueId()`
- `@NotNull public NamespacedKey getKey()`
- `@NotNull public String getName()`
- `public double getAmount()`
- `@NotNull public AttributeModifier.Operation getOperation()`
- `@Nullable @Deprecated(since="1.20.5") public EquipmentSlot getSlot()`
- `@NotNull public EquipmentSlotGroup getSlotGroup()`
- `@NotNull public Map<String,Object> serialize()`
- `public boolean equals(Object other)`
- `public int hashCode()`
- `public String toString()`
- `@NotNull public static AttributeModifier deserialize(@NotNull Map<String,Object> args)`
