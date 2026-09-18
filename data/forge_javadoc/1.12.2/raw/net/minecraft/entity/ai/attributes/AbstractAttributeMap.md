---
title: "AbstractAttributeMap"
description: "public abstract class AbstractAttributeMap extends java.lang.Object"
package: "net/minecraft/entity/ai/attributes"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/ai/attributes/AbstractAttributeMap.html"
sourceType: javadoc
---

# AbstractAttributeMap

## Class signature

```java
public abstract class AbstractAttributeMap extends java.lang.Object
```

## Constructors

- `public AbstractAttributeMap()`

## Methods

- `public IAttributeInstance getAttributeInstance( IAttribute attribute)`
- `public IAttributeInstance getAttributeInstanceByName(java.lang.String attributeName)`
- `public IAttributeInstance registerAttribute( IAttribute attribute)`
- `protected abstract IAttributeInstance createInstance( IAttribute attribute)`
- `public java.util.Collection< IAttributeInstance > getAllAttributes()`
- `public void onAttributeModified( IAttributeInstance instance)`
- `public void removeAttributeModifiers(<any> modifiers)`
- `public void applyAttributeModifiers(<any> modifiers)`
