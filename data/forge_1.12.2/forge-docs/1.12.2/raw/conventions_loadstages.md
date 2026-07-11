---
version: "1.12.2"
forgeVersion: "14.23.5.2858"
chapter: "conventions/loadstages"
source: "https://docs.readthedocs.net/en/1.12.x/conventions/loadstages/"
sourceType: mkdocs
---
# Loading Stages

Forge loads your mod in 3 main stages: Pre-Initialization, Initialization, and Post-Initialization, commonly referred to as preInit, init, and postInit. There are some other events that are important too, depending on what your mod does. Each of these stages occurs at a different point in the loading stage and thus what can be safely done in each stage varies.

> **Note**: Note Loading stage events can only be used in your @Mod class, in methods marked with the @EventHandler annotation.

> **Warning**: Warning Many objects (e.g. Blocks, Items, Recipes, etc.) that were previously registered in Pre-Initialization, or other stage event handlers, should now be registered via registry events. This is to pave the way to being able to reload mods dynamically at runtime, which can&rsquo;t be done using loading stages (as they are fired once upon application startup). RegistryEvents are fired after Pre-Initialization.

## Pre-Initialization

Pre Init is the place set anything up that is required by your own or other mods. This stage&rsquo;s event is the `FMLPreInitializationEvent`. Common actions to preform in preInit are:

- <li>Creating and reading the config file
- <li>Registering [Capabilities](../../datastorage/capabilities/)

## Initialization

Init is where to accomplish any game related tasks that rely upon the items and blocks set up in preInit. This stage&rsquo;s event is the `FMLInitializationEvent`. Common actions to preform in init are:

- <li>Registering world generators
- <li>Registering event handlers
- <li>Sending IMC messages

## Post-Initialization

Post Init is where your mod usually does things which rely upon other mods. This stage&rsquo;s event is the `FMLPostInitializationEvent`. Common actions to preform in postInit are:

- <li>Mod compatibility, or anything which depends on other mods&rsquo; init phases being finished.

## Other Important Events

- <li>IMCEvent: Process received IMC Messages
- <li>FMLServerStartingEvent: Register Commands