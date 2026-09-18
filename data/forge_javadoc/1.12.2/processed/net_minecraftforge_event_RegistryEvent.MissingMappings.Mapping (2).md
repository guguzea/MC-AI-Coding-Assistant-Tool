# RegistryEvent.MissingMappings.Mapping

## Constructors

- `public Mapping( IForgeRegistry < T > registry, IForgeRegistry < T > pool, ResourceLocation key, int id)`

## Methods

- `public void ignore()`
- `public void warn()`
- `public void fail()`
- `public void remap( T target)`
- `public RegistryEvent.MissingMappings.Action getAction()`
- `public T getTarget()`

## Description

Prevent the world from loading due to the missing item.