---
title: "BaseAttributeMap"
description: "Registers an attribute with this AttributeMap, returns a modifiable AttributeInstance associated with this map"
package: "net/minecraft/entity/ai/attributes"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/ai/attributes/BaseAttributeMap.html"
sourceType: javadoc
---

# BaseAttributeMap

## Class signature

```java
public abstract class BaseAttributeMap extends java.lang.Object
```

## Constructors

- `public BaseAttributeMap()`

## Methods

- `public IAttributeInstance getAttributeInstance( IAttribute attribute)`
- `public IAttributeInstance getAttributeInstanceByName(java.lang.String attributeName)`
- `public IAttributeInstance registerAttribute( IAttribute attribute)`
- `protected abstract IAttributeInstance func_180376_c( IAttribute p_180376_1_)`
- `public java.util.Collection< IAttributeInstance > getAllAttributes()`
- `public void func_180794_a( IAttributeInstance p_180794_1_)`
- `public void removeAttributeModifiers(<any> p_111148_1_)`
- `public void applyAttributeModifiers(<any> p_111147_1_)`

## Description

Registers an attribute with this AttributeMap, returns a modifiable AttributeInstance associated with this map
