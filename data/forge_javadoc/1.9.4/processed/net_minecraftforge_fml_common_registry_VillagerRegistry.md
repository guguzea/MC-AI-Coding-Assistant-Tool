# VillagerRegistry

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.VillagerRegistry

## Class signature

```java
public class VillagerRegistry extends java.lang.Object
```

## Methods

- `static void addExtraVillageComponents(java.util.List<StructureVillagePieces.PieceWeight> list, java.util.Random random, int i)`
- `IForgeRegistry<VillagerRegistry.VillagerProfession> getRegistry()`
- `static StructureVillagePieces.Village getVillageComponent(StructureVillagePieces.PieceWeight villagePiece, StructureVillagePieces.Start startPiece, java.util.List<StructureComponent> pieces, java.util.Random random, int p1, int p2, int p3, EnumFacing facing, int p5)`
- `static VillagerRegistry instance()`
- `static void onSetProfession(EntityVillager entity, int network)`
- `static void onSetProfession(EntityVillager entity, VillagerRegistry.VillagerProfession prof)`
- `void register(VillagerRegistry.VillagerProfession prof)`
- `void registerVillageCreationHandler(VillagerRegistry.IVillageCreationHandler handler)` — Register a new village creation handler
- `static void setRandomProfession(EntityVillager entity, java.util.Random rand)` — Hook called when spawning a Villager, sets it's profession to a random registered profession.

## Fields

- `static ResourceLocation PROFESSIONS`