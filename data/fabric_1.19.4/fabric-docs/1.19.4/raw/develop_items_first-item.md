# items first item

> 来源：https://docs.fabricmc.net/develop/items/first-item
> 版本：1.19.4
> GitHub 路径：develop/items/first-item.md
> 抓取源：vitepress

# Creating Your First Item 26.1.2 ​
Learn how to register a simple item and how to texture, model and name it.This page will introduce you into some key concepts relating to items, and how you can register, texture, model and name them.

If you aren't aware, everything in Minecraft is stored in registries, and items are no exception to that.

## Preparing Your Items Class ​
To simplify the registering of items, you can create a method that accepts a string identifier, some item properties and a factory to create the Item instance.

This method will create an item with the provided identifier and register it with the game's item registry.

You can put this method in a class called ModItems (or whatever you want to name the class).

Mojang does this with their items as well! Check out the Items class for inspiration.

javapublic class ModItems {
	public static <T extends Item> T register(String name, Function<Item.Properties, T> itemFactory, Item.Properties settings) {
		// Create the item key.
		ResourceKey<Item> itemKey = ResourceKey.create(Registries.ITEM, Identifier.fromNamespaceAndPath(ExampleMod.MOD_ID, name));

		// Create the item instance.
		T item = itemFactory.apply(settings.setId(itemKey));

		// Register the item.
		Registry.register(BuiltInRegistries.ITEM, itemKey, item);

		return item;
	}

}123456789101112131415Notice how we're using T, a generic type that extends Item. This allows us to use the same method register for registering any type of item that extends Item. We're also using a Function for the factory, which allows us to specify how we want our item to be created given the item properties.

## Registering an Item ​
You can now register an item using the method now.

The register method takes in an instance of the Item.Properties class as a parameter. This class allows you to configure the item's properties through various builder methods.

TIPIf you want to change your item's stack size, you can use the stacksTo method in the Item.Properties class.

This will not work if you've marked the item as damageable, as the stack size is always 1 for damageable items to prevent duplication exploits.

javapublic static final Item SUSPICIOUS_SUBSTANCE = register("suspicious_substance", Item::new, new Item.Properties());1Item::new tells the register function to create an Item instance from an Item.Properties by calling the Item constructor (new Item(...)), which takes an Item.Properties as a parameter.

However, if you now try to run the modified client, you can see that our item doesn't exist in-game yet! This is because you didn't statically initialize the class.

To do this, you can add a public static initialize method to your class and call it from your mod's initializer class. Currently, this method doesn't need anything inside it.

javapublic static void initialize() {
}12javapublic class ExampleModItems implements ModInitializer {
	@Override
	public void onInitialize() {
		ModItems.initialize();
	}
}123456Calling a method on a class statically initializes it if it hasn't been previously loaded - this means that all static fields are evaluated. This is what this dummy initialize method is for.

## Adding the Item to a Creative Tab ​
INFOIf you want to add the item to a custom creative tab, check out the Custom Creative Tabs page for more information.

For example purposes, we will add this item to the ingredients CreativeModeTab, you will need to use Fabric API's creative tab events - specifically CreativeModeTabEvents.modifyOutputEvent

This can be done in the initialize method of your items class.

java// Get the event for modifying entries in the ingredients group.
// And register an event handler that adds our suspicious item to the ingredients group.
CreativeModeTabEvents.modifyOutputEvent(CreativeModeTabs.INGREDIENTS)
		.register((creativeTab) -> creativeTab.accept(ModItems.SUSPICIOUS_SUBSTANCE));1234Loading into the game, you can see that our item has been registered, and is in the Ingredients creative tab:

However, it's missing the following:

- Item Model
- Texture
- Translation (name)

## Naming The Item ​
The item currently doesn't have a translation, so you will need to add one. The translation key has already been provided by Minecraft: item.example-mod.suspicious_substance.

Create a new JSON file at: src/main/resources/assets/example-mod/lang/en_us.json and put in the translation key, and its value:

json{
  "item.example-mod.suspicious_substance": "Suspicious Substance"
}123You can either restart the game or build your mod and press F3+T to apply changes.

## Adding a Client Item, Texture and Model ​
For your item to have a proper appearance, it requires:

- An item texture
- An item model
- A client item

### Adding a Texture ​
INFOFor more information on this topic, see the Item Models page.

To give your item a texture and model, simply create a 16x16 texture image for your item and save it in the assets/example-mod/textures/item folder. Name the texture file the same as the item's identifier, but with a .png extension.

For example purposes, you can use this example texture for suspicious_substance.png

[Download Texture](/assets/develop/items/first_item_1_small.png)
### Adding a Model ​
When restarting/reloading the game - you should see that the item still has no texture, that's because you will need to add a model that uses this texture.

You're going to create a simple item/generated model, which takes in an input texture and nothing else.

Create the model JSON in the assets/example-mod/models/item folder, with the same name as the item; suspicious_substance.json

json{
  "parent": "minecraft:item/generated",
  "textures": {
    "layer0": "example-mod:item/suspicious_substance"
  }
}123456
#### Breaking Down the Model JSON ​
- parent: This is the parent model that this model will inherit from. In this case, it's the item/generated model.
- textures: This is where you define the textures for the model. The layer0 key is the texture that the model will use.
Most items will use the item/generated model as their parent, as it's a simple model that just displays the texture.

There are alternatives, such as item/handheld which is used for items that are "held" in the player's hand, such as tools.

### Creating the Client Item ​
Minecraft doesn't automatically know where your items' model files can be found, we need to provide a client item.

Create the client item JSON in the assets/example-mod/items, with the same file name as the identifier of the item: suspicious_substance.json.

json{
  "model": {
    "type": "minecraft:model",
    "model": "example-mod:item/suspicious_substance"
  }
}123456
#### Breaking Down the Client Item JSON ​
- model: This is the property that contains the reference to our model. type: This is the type of our model. For most items, this should be minecraft:model
- model: This is the model's identifier. It should have this form: example-mod:item/item_name
Your item should now look like this in-game:

## Making the Item Compostable or a Fuel ​
Fabric API provides various registries that can be used to add additional properties to your item.

For example, if you want to make your item compostable, you can use the CompostableRegistry:

java// Add the suspicious substance to the composting registry with a 30% chance of increasing the composter's level.
CompostableRegistry.INSTANCE.add(ModItems.SUSPICIOUS_SUBSTANCE, 0.3f);12Alternatively, if you want to make your item a fuel, you can use the FuelValueEvents.BUILD event:

java// Add the suspicious substance to the registry of fuels, with a burn time of 30 seconds.
// Remember, Minecraft deals with logical based-time using ticks.
// 20 ticks = 1 second.
FuelValueEvents.BUILD.register((builder, context) -> {
	builder.add(ModItems.SUSPICIOUS_SUBSTANCE, 30 * 20);
});123456
## Adding a Basic Crafting Recipe ​
If you want to add a crafting recipe for your item, you will need to place a recipe JSON file in the data/example-mod/recipe folder.

For more information on the recipe format, check out these resources:

- Recipe JSON Generator
- Minecraft Wiki - Recipe JSON

## Custom Tooltips ​
If you want your item to have a custom tooltip, you will need to create a class that extends Item and override the appendHoverText method. Note that this method is deprecated as Mojang works to ensure item behaviour is handled entirely via components rather than via items - for more information, see Custom Data Components.

INFOThis example uses the LightningStick class created in the Custom Item Interactions page.

java@Override
public void appendHoverText(ItemStack stack, TooltipContext context, TooltipDisplay displayComponent, Consumer<Component> textConsumer, TooltipFlag type) {
	textConsumer.accept(Component.translatable("itemTooltip.example-mod.lightning_stick").withStyle(ChatFormatting.GOLD));
}1234Each call to accept() will add one line to the tooltip.