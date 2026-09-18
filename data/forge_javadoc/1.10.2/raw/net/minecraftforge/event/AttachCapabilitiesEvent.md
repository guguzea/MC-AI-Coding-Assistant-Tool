---
title: "AttachCapabilitiesEvent"
description: "Fired whenever an object with Capabilities support {currently TileEntity/Item/Entity) is created. Allowing for the attachment of arbitrary capability providers. Please note that as this is fired for A"
package: "net/minecraftforge/event"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/event/AttachCapabilitiesEvent.html"
sourceType: javadoc
---

# AttachCapabilitiesEvent

## Class signature

```java
public class AttachCapabilitiesEvent<T> extends GenericEvent <T>
```

## Constructors

- `public AttachCapabilitiesEvent(java.lang.Class< T > type, T obj)`

## Methods

- `@Deprecated public AttachCapabilitiesEvent( T obj)`
- `public T getObject()`
- `public void addCapability( ResourceLocation key, ICapabilityProvider cap)`
- `public java.util.Map< ResourceLocation , ICapabilityProvider > getCapabilities()`

## Description

Fired whenever an object with Capabilities support {currently TileEntity/Item/Entity) is created. Allowing for the attachment of arbitrary capability providers. Please note that as this is fired for A
