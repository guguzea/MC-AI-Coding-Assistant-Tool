# RegistryEvent.Register

## Constructors

- `public Register( ResourceLocation name, IForgeRegistry < T > registry)`

## Methods

- `public IForgeRegistry < T > getRegistry()`
- `public ResourceLocation getName()`

## Description

Register your objects for the appropriate registry type when you receive this event. event.getRegistry().register(...) The registries will be visited in alphabetic order of their name, except blocks a