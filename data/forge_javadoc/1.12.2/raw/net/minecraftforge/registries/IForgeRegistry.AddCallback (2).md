---
title: "IForgeRegistry.AddCallback"
description: "Callback fired when objects are added to the registry. This will fire when the registry is rebuilt on the client side from a server side synchronization, or when a world is loaded."
package: "net/minecraftforge/registries"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/registries/IForgeRegistry.AddCallback.html"
sourceType: javadoc
---

# IForgeRegistry.AddCallback

## Methods

- `void onAdd( IForgeRegistryInternal < V > owner, RegistryManager stage, int id, V obj, V oldObj)`

## Description

Callback fired when objects are added to the registry. This will fire when the registry is rebuilt on the client side from a server side synchronization, or when a world is loaded.
