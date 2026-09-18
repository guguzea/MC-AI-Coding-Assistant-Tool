---
title: "AttachCapabilitiesEvent"
description: "Fired whenever an object with Capabilities support {currently TileEntity/Item/Entity) is created. Allowing for the attachment of arbitrary capability providers. Please note that as this is fired for A"
package: "net/minecraftforge/event"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/AttachCapabilitiesEvent.html"
sourceType: javadoc
---

# AttachCapabilitiesEvent

## Class signature

```java
public class AttachCapabilitiesEvent extends Event
```

## Constructors

- `public AttachCapabilitiesEvent(java.lang.Object obj)`

## Methods

- `public java.lang.Object getObject()`
- `public void addCapability( ResourceLocation key, ICapabilityProvider cap)`
- `public java.util.Map< ResourceLocation , ICapabilityProvider > getCapabilities()`

## Description

Fired whenever an object with Capabilities support {currently TileEntity/Item/Entity) is created. Allowing for the attachment of arbitrary capability providers. Please note that as this is fired for A
