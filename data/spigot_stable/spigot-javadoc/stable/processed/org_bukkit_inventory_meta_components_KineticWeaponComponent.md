---
title: "org.bukkit.inventory.meta.components.KineticWeaponComponent"
package: "org.bukkit.inventory.meta.components"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/meta/components/KineticWeaponComponent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface KineticWeaponComponent**
`@Experimental public interface KineticWeaponComponent extends ConfigurationSerializable`
- `int getContactCooldownTicks()`
- `void setContactCooldownTicks(int ticks)`
- `int getDelayTicks()`
- `void setDelayTicks(int ticks)`
- `@Nullable KineticWeaponComponent.Condition getDismountConditions()`
- `void setDismountConditions(@Nullable KineticWeaponComponent.Condition condition)`
- `@Nullable KineticWeaponComponent.Condition getKnockbackConditions()`
- `void setKnockbackConditions(@Nullable KineticWeaponComponent.Condition condition)`
- `@Nullable KineticWeaponComponent.Condition getDamageConditions()`
- `void setDamageConditions(@Nullable KineticWeaponComponent.Condition condition)`
- `float getForwardMovement()`
- `void setForwardMovement(float movement)`
- `float getDamageMultiplier()`
- `void setDamageMultipler(float multiplier)`
- `@Nullable Sound getSound()`
- `void setSound(@Nullable Sound sound)`
- `@Nullable Sound getHitSound()`
- `void setHitSound(@Nullable Sound sound)`
