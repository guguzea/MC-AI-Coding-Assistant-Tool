---
title: "VillagerTradeTrigger"
description: "public class VillagerTradeTrigger extends java.lang.Object implements ICriterionTrigger < VillagerTradeTrigger.Instance >"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/VillagerTradeTrigger.html"
sourceType: javadoc
---

# VillagerTradeTrigger

## Class signature

```java
public class VillagerTradeTrigger extends java.lang.Object implements ICriterionTrigger < VillagerTradeTrigger.Instance >
```

## Constructors

- `public VillagerTradeTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < VillagerTradeTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < VillagerTradeTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public VillagerTradeTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, EntityVillager villager, ItemStack item)`
