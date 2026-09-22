---
title: "AttachCapabilitiesEvent"
description: "public class AttachCapabilitiesEvent extends Event"
package: "net/minecraftforge/event"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/event/AttachCapabilitiesEvent.html"
sourceType: javadoc
---

# AttachCapabilitiesEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.AttachCapabilitiesEvent

## Class signature

```java
public class AttachCapabilitiesEvent extends Event
```

## Constructors

- `AttachCapabilitiesEvent(java.lang.Object obj)`

## Methods

- `void addCapability(ResourceLocation key, ICapabilityProvider cap)` — Adds a capability to be attached to this object.
- `java.util.Map<ResourceLocation, ICapabilityProvider> getCapabilities()` — A unmodifiable view of the capabilities that will be attached to this object.
- `java.lang.Object getObject()` — Retrieves the object that is being created, Not much state is set.
