# FMLMissingMappingsEvent.MissingMapping

## Constructors

- `public MissingMapping( GameRegistry.Type type, ResourceLocation name, int id)`

## Methods

- `public void ignore()`
- `public void warn()`
- `public void fail()`
- `public void remap( Block target)`
- `public void remap( Item target)`
- `public void skipItemBlock()`
- `public FMLMissingMappingsEvent.Action getAction()`
- `public java.lang.Object getTarget()`

## Description

Prevent the world from loading due to the missing item.