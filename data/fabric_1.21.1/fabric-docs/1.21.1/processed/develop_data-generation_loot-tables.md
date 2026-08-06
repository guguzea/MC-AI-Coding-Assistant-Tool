
# Loot Table Generation 26.1.2 ​
A guide to setting up loot table generation with datagen.PREREQUISITESMake sure you've completed the datagen setup process first.

You will need different providers (classes) for blocks, chests, and entities. Remember to add them all to your pack in your DataGeneratorEntrypoint within the onInitializeDataGenerator method.

javapack.addProvider(ExampleModBlockLootTableProvider::new);
pack.addProvider(ExampleModChestLootTableProvider::new);12
## Loot Tables Explained ​
Loot tables define what you get from breaking a block (not including contents, like in chests), killing an entity, or opening a newly-generated container. Each loot table has pools from which items are selected. Loot tables also have functions, which modify the resulting loot in some way.

Loot pools have entries, conditions, functions, rolls, and bonus rolls. Entries are groups, sequences, or possibilities of items, or just items. Conditions are things that are tested for in the world, such as enchantments on a tool or a random chance. The minimum number of entries chosen by a pool are called rolls, and anything over that is called a bonus roll.

## Blocks ​
In order for blocks to drop items - including itself - we need to make a loot table. Create a class that extends FabricBlockLootTableProvider:

javapublic class ExampleModBlockLootTableProvider extends FabricBlockLootSubProvider {
	protected ExampleModBlockLootTableProvider(FabricPackOutput dataOutput, CompletableFuture<HolderLookup.Provider> registryLookup) {
		super(dataOutput, registryLookup);
	}

	@Override
	public void generate() {
	}
}123456789Make sure to add this provider to your pack!

There's a lot of helper methods available to help you build your loot tables. We won't go over all of them, so make sure to check them out in your IDE.

Let's add a few drops in the generate method:

java// Make condensed dirt drop its block item.
// Also adds the condition that it survives the explosion that broke it, if applicable,
dropSelf(ModBlocks.CONDENSED_DIRT);
// Make prismarine lamps drop themselves with silk touch only
dropWhenSilkTouch(ModBlocks.PRISMARINE_LAMP);
// Make condensed oak logs drop between 7 and 9 oak logs
add(ModBlocks.CONDENSED_OAK_LOG, LootTable.lootTable().withPool(applyExplosionCondition(Items.OAK_LOG, LootPool.lootPool()
		.setRolls(new UniformGenerator(new ConstantValue(7), new ConstantValue(9)))
		.add(LootItem.lootTableItem(Items.OAK_LOG))))
);12345678910
## Chests ​
Chest loot is a little bit tricker than block loot. Create a class that extends SimpleFabricLootTableProvider similar to the example below and add it to your pack.

javapublic class ExampleModChestLootTableProvider extends SimpleFabricLootTableSubProvider {
	public ExampleModChestLootTableProvider(FabricPackOutput output, CompletableFuture<HolderLookup.Provider> registryLookup) {
		super(output, registryLookup, LootContextParamSets.CHEST);
	}

	@Override
	public void generate(BiConsumer<ResourceKey<LootTable>, LootTable.Builder> lootTableBiConsumer) {
	}
}123456789We'll need a ResourceKey for our loot table. Let's put that in a new class called ModLootTables. Make sure this is in your main source set if you're using split sources.

javapublic class ModLootTables {
	public static ResourceKey<LootTable> TEST_CHEST_LOOT = ResourceKey.create(Registries.LOOT_TABLE, Identifier.fromNamespaceAndPath(ExampleMod.MOD_ID, "chests/test_loot"));
}123Then, we can generate a loot table inside the generate method of your provider.

javalootTableBiConsumer.accept(ModLootTables.TEST_CHEST_LOOT, LootTable.lootTable()
		.withPool(LootPool.lootPool() // One pool
				.setRolls(ConstantValue.exactly(2.0f)) // That has two rolls
				.add(LootItem.lootTableItem(Items.DIAMOND) // With an entry that has diamond(s)
						.apply(SetItemCountFunction.setCount(ConstantValue.exactly(1.0f)))) // One diamond
				.add(LootItem.lootTableItem(Items.DIAMOND_SWORD) // With an entry that has a plain diamond sword
				)
		));12345678
## Resource Conditions ​
To apply a resource condition to a data generated loot table, call withConditions and provide any resource conditions you want to apply, then call a method from the loot table provider, such as dropSelf. This will then generate a loot table that has resource conditions applied:


<!-- key:🟠 role:常见错误 -->

java// Make the duplicator never drop via resource conditions
withConditions(ResourceConditions.not(ResourceConditions.alwaysTrue()))
		.dropSelf(ModBlocks.DUPLICATOR_BLOCK);123Copied