
# Tag Generation 26.1.2 ​
A guide to setting up tag generation with datagen.PREREQUISITESMake sure you've completed the datagen setup process first.

## Setup ​
Here we'll show how to create Item tags, but the same principle applies for other things.

Fabric provides several helper tag providers including one for items; FabricTagsProvider.ItemTagsProvider. We will use this helper class for this example.

You can create your own class that extends FabricTagsProvider, where T is the type of thing you'd like to provide a tag for. This is your provider.

Let your IDE fill in the required code, then replace the resourceKey constructor parameter with the ResourceKey for your type:

javapublic class ExampleModItemTagProvider extends FabricTagsProvider.ItemTagsProvider {
	public ExampleModItemTagProvider(FabricPackOutput output, CompletableFuture<HolderLookup.Provider> registriesFuture) {
		super(output, registriesFuture);
	}

	@Override
	protected void addTags(HolderLookup.Provider wrapperLookup) {
	}
}123456789TIPYou will need a different provider for each type of tag (eg. one FabricTagsProvider> and one FabricTagsProvider).

To finish setup, add this provider to your DataGeneratorEntrypoint within the onInitializeDataGenerator method.

javapack.addProvider(ExampleModItemTagProvider::new);1
## Creating a Tag ​
Now that you've created a provider, let's add a tag to it. First, create a TagKey:

javapublic static final TagKey<Item> SMELLY_ITEMS = TagKey.create(Registries.ITEM, Identifier.fromNamespaceAndPath(ExampleMod.MOD_ID, "smelly_items"));1Next, call valueLookupBuilder inside your provider's configure method. From there, you can add individual items, add other tags, or make this tag replace pre-existing tags.

If you want to add a tag, use addOptionalTag, as the tag's contents may not be loaded during datagen. If you are certain the tag is loaded, call addTag.

To forcefully add a tag and ignore the broken format, use forceAddTag.

javavalueLookupBuilder(SMELLY_ITEMS)
		.add(Items.SLIME_BALL)
		.add(Items.ROTTEN_FLESH)
		.addOptionalTag(ItemTags.DIRT)
		.add(Items.OAK_PLANKS)
		.forceAddTag(ItemTags.BANNERS)
		.setReplace(true);1234567Copied