---
title: "AbstractAttributeMap"
description: "public abstract class AbstractAttributeMap extends java.lang.Object"
package: "net/minecraft/entity/ai/attributes"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/ai/attributes/AbstractAttributeMap.html"
sourceType: javadoc
---

# AbstractAttributeMap

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.attributes.AbstractAttributeMap

## Class signature

```java
public abstract class AbstractAttributeMap extends java.lang.Object
```

## Constructors

- `AbstractAttributeMap()`

## Methods

- `void applyAttributeModifiers(<any> modifiers)`
- `protected abstract IAttributeInstance createInstance(IAttribute attribute)`
- `java.util.Collection<IAttributeInstance> getAllAttributes()`
- `IAttributeInstance getAttributeInstance(IAttribute attribute)`
- `IAttributeInstance getAttributeInstanceByName(java.lang.String attributeName)`
- `void onAttributeModified(IAttributeInstance instance)`
- `IAttributeInstance registerAttribute(IAttribute attribute)`
- `void removeAttributeModifiers(<any> modifiers)`

## Fields

- `protected java.util.Map<IAttribute, IAttributeInstance> attributes`
- `protected java.util.Map<java.lang.String, IAttributeInstance> attributesByName`
- `protected<any> descendantsByParent`
