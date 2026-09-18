# IForgeRegistry.AddCallback

## Methods

- `void onAdd( IForgeRegistryInternal < V > owner, RegistryManager stage, int id, V obj, V oldObj)`

## Description

Callback fired when objects are added to the registry. This will fire when the registry is rebuilt on the client side from a server side synchronization, or when a world is loaded.