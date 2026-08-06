
# Tools and Weapons 26.1.2 ​
Learn how to create your own tools and configure their properties.Tools are essential for survival and progression, allowing players to gather resources, construct buildings, and defend themselves.

## Creating a Tool Material ​
You can create a tool material by instantiating a new ToolMaterial object and storing it in a field that can be used later to create the tool items that use the material.

javapublic static final ToolMaterial GUIDITE_TOOL_MATERIAL = new ToolMaterial(

<!-- key:🟠 role:常见错误 -->

		INCORRECT_FOR_GUIDITE_TOOL, // incorrect blocks for drops
		455, // durability
		5.0F, // speed
		1.5F, // attack damage bonus
		22, // enchantment value
		GuiditeArmorMaterial.REPAIRS_GUIDITE_ARMOR // repair items
);12345678The ToolMaterial constructor accepts the following parameters, in this specific order:


<!-- key:🟠 role:常见错误 -->

ParameterDescription`incorrectBlocksForDrops`If a block is in the `incorrectBlocksForDrops` tag, it means that when you use a tool made from this `ToolMaterial` on that block, the block will not drop any items.`durability`The durability of all tools that are of this `ToolMaterial`.`speed`The mining speed of the tools that are of this `ToolMaterial`.`attackDamageBonus`The additional attack damage of the tools that are of this `ToolMaterial` will have.`enchantmentValue`The "Enchantability" of tools which are of this `ToolMaterial`.`repairItems`Any items within this tag can be used to repair tools of this `ToolMaterial` in an anvil.For this example, we will use the same repair item tag we will be using for armor. We define the tag reference as follows:

javapublic static final TagKey<Item> REPAIRS_GUIDITE_ARMOR = TagKey.create(BuiltInRegistries.ITEM.key(), Identifier.fromNamespaceAndPath(ExampleMod.MOD_ID, "repairs_guidite_armor"));1If you're struggling to determine balanced values for any of the numerical parameters, you should consider looking at the vanilla tool material constants, such as ToolMaterial.STONE or ToolMaterial.DIAMOND.

### Creating the Tool Material Tag ​

<!-- key:🟠 role:常见错误 -->

For our incorrectBlocksForDrops tag, we can create a tag similar to vanilla's minecraft:incorrect_for_*_drops tags, which determines the blocks that will not drop when mined with the material. Let's define the tag reference as follows:


<!-- key:🟠 role:常见错误 -->

javapublic static final TagKey<Block> INCORRECT_FOR_GUIDITE_TOOL = TagKey.create(BuiltInRegistries.BLOCK.key(),

<!-- key:🟠 role:常见错误 -->

		Identifier.fromNamespaceAndPath(ExampleMod.MOD_ID, "incorrect_for_guidite_tool"));12Next, we define the tag's contents using a tag JSON. Let's make Guidite tools be able to mine the same blocks as wooden tools, plus Copper Ore and Deepslate Copper Ore:

json{

<!-- key:🟠 role:常见错误 -->

  "values": ["#minecraft:incorrect_for_wooden_tool"],
  "fabric:remove": ["#minecraft:copper_ores"]
}1234Note that this example inherits from a weaker tool material and removes entries that our stronger material can mine, inheriting all of the other blocks that wood cannot.

TIPWe could also do the reverse: inherit from a stronger tool and append additional blocks that Guidite tools are unfit for.


<!-- key:🟠 role:常见错误 -->

As an example, if we wanted to create a tool that worked like iron but couldn't mine Diamond Ore, values would need to contain #minecraft:incorrect_for_iron_tool and #minecraft:diamond_ores.


<!-- key:🟠 role:常见错误 -->

If you want to make your tool material mine the same blocks as an existing one, you can include the respective tag in your tag's definition without any additions or removals. This is recommended over passing the existing tag as your material's incorrectBlocksForDrops so that users can configure the incorrect blocks for each of the materials independently.

## Registering Tool Items ​
Using the same utility function as in the Creating Your First Item guide, you can create your tool items:

javapublic static final Item GUIDITE_SWORD = register(
		"guidite_sword",
		Item::new,
		new Item.Properties().sword(GUIDITE_TOOL_MATERIAL, 1f, 1f)
);12345The two float values (1f, 1f) refer to the attack damage of the tool and the attack speed of the tool respectively.

For shovels, axes, and hoes, you should create a ShovelItem, AxeItem, or HoeItem instead of a generic Item, as these implement tool-specific right-click actions:

javapublic static final Item GUIDITE_AXE = register(
				"guidite_axe",
				settings -> new AxeItem(GUIDITE_TOOL_MATERIAL, 5.0F, -3.0F, settings),
				new Item.Properties());1234INFOShovelItem, AxeItem, and HoeItem call the shovel, axe, or hoe method of Item.Properties in their constructors.

Remember to add them to a creative tab if you want to access them from the creative inventory!

javaCreativeModeTabEvents.modifyOutputEvent(CreativeModeTabs.TOOLS_AND_UTILITIES)
		.register((creativeTab) -> creativeTab.accept(ModItems.GUIDITE_SWORD));12You will also have to add a texture, item translation and item model. However, for the item model, you'll want to use the item/handheld model as your parent instead of the usual item/generated.

## Assets ​
You will also have to add a texture, translation, client item, and item model. However, for the item model, you'll want to use the item/handheld model as your parent instead of the usual item/generated.

For this example, we will be defining the following client item, model and texture for the "Guidite Sword" item:

Source CodeClient ItemItem ModelTextureINFOThis model can be data generated. For more information, see the documentation on generating item models.

javaitemModelGenerator.generateFlatItem(ModItems.GUIDITE_SWORD, ModelTemplates.FLAT_HANDHELD_ITEM);1A similar pattern applies to the "Guidite Axe" item.

Source CodeClient ItemItem ModelTexturejavaitemModelGenerator.generateFlatItem(ModItems.GUIDITE_AXE, ModelTemplates.FLAT_HANDHELD_ITEM);1
## Tagging Tool Items ​
PREREQUISITESFor more information, see the documentation on generating item tags.

It's also recommended to place your tool in the appropriate item tags. Tools have their own individual tags, such as ItemTags.SWORDS, which are used for enchantability and other specific logic, like whether to apply sweeping damage.

In your item tag provider, add the following lines to addTags:

javavalueLookupBuilder(ItemTags.SWORDS)
				.add(ModItems.GUIDITE_SWORD);
valueLookupBuilder(ItemTags.AXES)
				.add(ModItems.GUIDITE_AXE);1234That's pretty much it! If you go in-game you should see your tools in the "Tools and Utilities" tab of the creative inventory menu.

Copied