---
title: "VillagerTradeTrigger"
description: "public class VillagerTradeTrigger extends java.lang.Object implements ICriterionTrigger<VillagerTradeTrigger.Instance>"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/VillagerTradeTrigger.html"
sourceType: javadoc
---

# VillagerTradeTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.VillagerTradeTrigger

## Class signature

```java
public class VillagerTradeTrigger extends java.lang.Object implements ICriterionTrigger<VillagerTradeTrigger.Instance>
```

## Constructors

- `VillagerTradeTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<VillagerTradeTrigger.Instance> listener)`
- `VillagerTradeTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<VillagerTradeTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, EntityVillager villager, ItemStack item)`
