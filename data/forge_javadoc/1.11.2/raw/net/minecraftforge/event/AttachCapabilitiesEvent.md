---
title: "AttachCapabilitiesEvent"
description: "public class AttachCapabilitiesEvent<T> extends GenericEvent<T>"
package: "net/minecraftforge/event"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/AttachCapabilitiesEvent.html"
sourceType: javadoc
---

# AttachCapabilitiesEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.fml.common.eventhandler.GenericEvent<T> → net.minecraftforge.event.AttachCapabilitiesEvent<T>

## Class signature

```java
public class AttachCapabilitiesEvent<T> extends GenericEvent<T>
```

## Constructors

- `AttachCapabilitiesEvent(java.lang.Class<T> type, T obj)`
- `@Deprecated AttachCapabilitiesEvent(T obj)`

## Methods

- `void addCapability(ResourceLocation key, ICapabilityProvider cap)` — Adds a capability to be attached to this object.
- `java.util.Map<ResourceLocation, ICapabilityProvider> getCapabilities()` — A unmodifiable view of the capabilities that will be attached to this object.
- `T getObject()` — Retrieves the object that is being created, Not much state is set.
