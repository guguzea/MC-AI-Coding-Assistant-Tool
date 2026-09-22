---
title: "BaseAttributeMap"
description: "public abstract class BaseAttributeMap extends java.lang.Object"
package: "net/minecraft/entity/ai/attributes"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/ai/attributes/BaseAttributeMap.html"
sourceType: javadoc
---

# BaseAttributeMap

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.attributes.BaseAttributeMap

## Class signature

```java
public abstract class BaseAttributeMap extends java.lang.Object
```

## Constructors

- `BaseAttributeMap()`

## Methods

- `void applyAttributeModifiers(<any> p_111147_1_)`
- `protected abstract IAttributeInstance func_180376_c(IAttribute p_180376_1_)`
- `void func_180794_a(IAttributeInstance p_180794_1_)`
- `java.util.Collection<IAttributeInstance> getAllAttributes()`
- `IAttributeInstance getAttributeInstance(IAttribute attribute)`
- `IAttributeInstance getAttributeInstanceByName(java.lang.String attributeName)`
- `IAttributeInstance registerAttribute(IAttribute attribute)` — Registers an attribute with this AttributeMap, returns a modifiable AttributeInstance associated with this map
- `void removeAttributeModifiers(<any> p_111148_1_)`

## Fields

- `protected java.util.Map<IAttribute, IAttributeInstance> attributes`
- `protected java.util.Map<java.lang.String, IAttributeInstance> attributesByName`
- `protected<any> field_180377_c`
