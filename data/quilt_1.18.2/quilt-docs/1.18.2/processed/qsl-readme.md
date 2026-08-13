> 来源：https://raw.githubusercontent.com/QuiltMC/quilt-standard-libraries/1.18/README.md
> 抓取时间：2026-08-13T15:10:59.334Z

# Quilt Standard Libraries

**Note: At the moment, the Quilt Standard Libraries are not ready for general use. Please make an issue or talk to the
QSL team on discord before writing any PRs.**

## Repository structure

The repository has 2 main parts:

- The `library` folder. This contains all the libraries that are part of the Quilt Standard Libraries.
- The `build-logic` folder. This is an included build in Gradle and contains most of the buildscript used inside the
  libraries. This keeps the buildscripts inside the `library` folder as minimal as possible; definitions of data rather
  than logic.

## Features

Here are multiple charts of features available in QSL which also serves as a comparison chart with Fabric API.

The charts are organized by QSL libraries.

Quick legend:

 - ✔ = Included
 - ❌ = Not Included/Not Yet
 - 🙅 = No plans
 - 🚧 = Work In Progress

### Core Library

| Feature                           | QSL |  Fabric API   |
|:----------------------------------|:---:|:-------------:|
| Auto Test Server argument         |  ✔  |       ❌       |
| Event API                         |  ✔  |       ✔       |
| Event API - Phases                |  ✔  |       ✔       |
| Event API - Events as Entrypoints |  ✔  |       ❌       |
| Gametest API                      |  ❌  |       ✔       |
| Initializer Entrypoints           |  ✔  | ✔ (in loader) |
| Networking API                    |  ✔  |       ✔       |

#### Crash Report

| Feature                        | QSL | Fabric API |
|:-------------------------------|:---:|:----------:|
| Crash report extra context     |  ✔  |     ✔      |
| Crash report extra context API |  ✔  |     ❌      |

### Core - Lifecycle Events

| Feature                    | QSL | Fabric API |
|:---------------------------|:---:|:----------:|
| Client Lifecycle Events    |  ✔  |     ✔      |
| Client Tick Events         |  ✔  |     ✔      |
| Client World Tick Events   |  ✔  |     ✔      |
| Client Block Entity Events |  ❌  |     ✔      |
| Client Chunk Entity Events |  ❌  |     ✔      |
| Client Entity Events       |  ❌  |     ✔      |
| Common Lifecycle Events    |  ❌  |     ✔      |
| Server Lifecycle Events    |  ✔  |     ✔      |
| Server Tick Events         |  ✔  |     ✔      |
| Server World Load Events   |  ✔  |     ✔      |
| Server World Tick Events   |  ✔  |     ✔      |
| Server Block Entity Events |  ❌  |     ✔      |
| Server Chunk Entity Events |  ❌  |     ✔      |
| Server Entity Events       |  ❌  |     ✔      |

### Core - Registry

| Feature                                     | QSL | Fabric API |
|:--------------------------------------------|:---:|:----------:|
| Addition Events                             |  ✔  |     ✔      |
| Addition Events Helper                      |  ✔  |     ❌      |
| Registry Syncing                            |  ✔  |     ✔      |
| Registry Syncing - Exclude Specific Entries |  ✔  |     ❌      |

### Core - Resource Loader

| Feature                               |   QSL    |            Fabric API            |
|:--------------------------------------|:--------:|:--------------------------------:|
| Load mod resources.                   |    ✔     |                ✔                 |
| Resource Loader Events                |    ✔     | ✔ (in lifecycle, non equivalent) |
| Built-in resource pack API            |    ✔     |                ✔                 |
| Programmer Art API                    |    ✔     |                ✔                 |
| Group resource pack API               |    ✔     |                🙅                |
| Resource Pack Provider API            |    ✔     |                ❌                 |
| Resource Reloaders                    |    ✔     |                ✔                 |
| Resource Reloaders - Advanced Sorting |    ✔     |                ❌                 |
| Virtual Resource Packs                | ❌ (1.18) |                ❌                 |

### Block Library

| Feature                                                 |   QSL    | Fabric API |
|:--------------------------------------------------------|:--------:|:----------:|
| Extended Block Settings                                 |    ✔     |     ✔      |
| Extended Material Builder                               |    ✔     |     ✔      |
| Block Render Layers API                                 |    ✔     |     ✔      |
| All Block Constructors Are Public                       |    ✔     |     ✔      |
| Block Entity Type registration helper                   |    ✔     |     ✔      |
| Block Entity Type post-creation supported block editing |    ✔     |     🙅     |
| Block Entity Syncing Helper                             |    ✔     |     ❌      |
| Block Content Registry - Flammable                      | ❌ (1.18) |     ✔      |
| Block Content Registry - Flammable (data-driven)        | ❌ (1.18) |     🙅     |
| Block Content Registry - Flattenable                    | ❌ (1.18) |     ✔      |
| Block Content Registry - Flattenable (data-driven)      | ❌ (1.18) |     🙅     |
| Block Content Registry - Oxidation                      | ❌ (1.18) |     ✔      |
| Block Content Registry - Oxidation (data-driven)        | ❌ (1.18) |     🙅     |
| Block Content Registry - Sculk Frequency                | ❌ (1.18) |     ✔      |
| Block Content Registry - Sculk Frequency (data-driven)  | ❌ (1.18) |     🙅     |
| Block Content Registry - Strippable                     | ❌ (1.18) |     ✔      |
| Block Content Registry - Strippable (data-driven)       | ❌ (1.18) |     🙅     |
| Block Content Registry - Tileable                       | ❌ (1.18) |     ✔      |
| Block Content Registry - Tileable (data-driven)         | ❌ (1.18) |     🙅     |
| Block Content Registry - Waxing                         | ❌ (1.18) |     ✔      |
| Block Content Registry - Waxing (data-driven)           | ❌ (1.18) |     🙅     |

### Data Library

| Feature                                                               |   QSL    | Fabric API |
|:----------------------------------------------------------------------|:--------:|:----------:|
| Advancement Criterion Registration Helper                             |    ✔     |     ✔      |
| Recipe API                                                            |    ✔     |     🙅     |
| Registry Entry Attachments                                            |    ✔     |     🙅     |
| Client-fallback/Client-only tags                                      |    ✔     |  ❌ (1.18)  |
| Client-fallback/Client-only tags - integration within Vanilla methods |    ✔     |     🙅     |
| Convention Tags                                                       |    ❌     |     ✔      |
| Data Generation                                                       | ❌ (1.18) |     ✔      |
| Loot Table API                                                        |    ❌     |     ✔      |
| Resource Conditions                                                   |    ❌     |     ✔      |

### Entity Library

| Feature                         |   QSL    | Fabric API |
|:--------------------------------|:--------:|:----------:|
| EntityType registration helpers | ❌ (1.18) |     ✔      |
| Entity Events                   | ❌ (1.18) |     ✔      |
| Multipart Entity API            |    ✔     |     ❌      |

### GUI Library

| Feature                   |   QSL    | Fabric API |
|:--------------------------|:--------:|:----------:|
| Screen API                |    ✔     |     ✔      |
| Item Tooltip Event        |    ✔     |     ✔      |
| Tooltip Component - Event |    ✔     |     ✔      |
| Key Binds API             | ❌ (1.18) |     ✔      |
| Screen Handler API        |    ❌     |     ✔      |

### Item Library

| Feature                                         | QSL | Fabric API |
|:------------------------------------------------|:---:|:----------:|
| Item Groups                                     |  ✔  |     ✔      |
| Item Settings                                   |  ✔  |     ✔      |
| Item Settings - Custom Item Setting             |  ✔  |     ❌      |
| Item Content Registry - Composter               |  ✔  |     ✔      |
| Item Content Registry - Composter (data-driven) |  ✔  |     🙅     |
| Item Content Registry - Fuel                    |  ✔  |     ✔      |
| Item Content Registry - Fuel (data-driven)      |  ✔  |     🙅     |

### Management Library

| Feature         | QSL | Fabric API |
|:----------------|:---:|:----------:|
| Commands        |  ✔  |     ✔      |
| Client Commands |  ✔  |     ✔      |
| Game Rules      |  ❌  |     ✔      |
| Message API     |  ❌  |     ✔      |

### Rendering Library

| Feature                                           |   QSL    |    Fabric API     |
|:--------------------------------------------------|:--------:|:-----------------:|
| Renderer API                                      |    ❌     |         ✔         |
| Data Attachment                                   |    ❌     |         ✔         |
| Hud Render API                                    |    ❌     | ✔ (limited Event) |
| Built-in Item Rendering                           |    ❌     |         ✔         |
| Block Entity Renderer Registry                    |    ❌     |         ✔         |
| Armor Rendering                                   |    ❌     |         ✔         |
| Color Provider Registry                           |    ❌     |         ✔         |
| Entity Renderer Registry                          |    ❌     |         ✔         |
| Entity Model Layer Registry                       |    ❌     |         ✔         |
| Living Entity Feature Renderer Registration Event |    ❌     |         ✔         |
| Data-driven Entity Models                         | ❌ (1.18) |        🙅         |
| Data-driven Animations                            | ❌ (1.18) |        🙅         |
| World Render Events                               |    ❌     |         ✔         |
| Fluid Rendering                                   |    ❌     |         ✔         |

### Transfer Library

| Feature      |      QSL       |    Fabric API     |
|:-------------|:--------------:|:-----------------:|
| Transfer API |       ❌        |         ✔         |

### Worldgen Library

| Feature                 | QSL | Fabric API |
|:------------------------|:---:|:----------:|
| Biome Modifications API |  ✔  |     ✔      |
| Add Nether Biomes       |  ✔  |     ✔      |
| Add End Biomes          |  ✔  |     ✔      |
| Dimension API           |  ✔  |     ✔      |
| Surface Rule API        |  ✔  |     ❌      |

### Miscellaneous Library

| Feature        |   QSL    | Fabric API |
|:---------------|:--------:|:----------:|
| Modded DFU API |    ✔     |     ❌      |
| API Lookup API | ❌ (1.18) |     ✔      |

[quilt]: https://quiltmc.org
[Mod loader: Quilt]: https://img.shields.io/badge/modloader-Quilt-9115ff?style=flat-square
