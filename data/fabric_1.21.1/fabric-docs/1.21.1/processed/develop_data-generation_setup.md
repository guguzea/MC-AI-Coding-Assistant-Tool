
# Data Generation Setup 26.1.2 ​
A guide to setting up Data Generation with Fabric API.
## What Is Data Generation? ​
Data generation (or datagen) is an API for programmatically generating recipes, advancements, tags, item models, language files, loot tables, and basically anything JSON-based.

## Enabling Data Generation ​

### At Project Creation ​
The easiest way to enable datagen is at project creation. Check the "Enable Data Generation" box when using the template generator.

TIPIf datagen is enabled, you should have a "Data Generation" run configuration and a runDatagen Gradle task.

### Manually ​
First, we need to enable datagen in the build.gradle file.

gradlefabricApi {
	configureDataGeneration() {
		client = true
	}
}12345Next, we need an entrypoint class. This is where our datagen starts. Place this somewhere in the client package - this example places it at src/client/java/com/example/docs/datagen/ExampleModDataGenerator.java.

javapublic class ExampleModDataGenerator implements DataGeneratorEntrypoint {
	@Override
	public void onInitializeDataGenerator(FabricDataGenerator fabricDataGenerator) {
	}
}12345Finally, we need to tell Fabric about the entrypoint in our fabric.mod.json:

json{
  // ...
  "entrypoints": {
    // ...
    "client": [
      // ...
    ],
    "fabric-datagen": [ 
      "com.example.docs.datagen.ExampleModDataGenerator"
    ] 
  }

<!-- key:🟠 role:常见错误 -->

}123456789101112WARNINGDon't forget to add a comma (,) after the previous entrypoint block!

Close and reopen IntelliJ to create a run configuration for datagen.

## Creating a Pack ​
Inside your datagen entrypoint's onInitializeDataGenerator method, we need to create a Pack. Later, you'll add providers, which put generated data into this Pack.

javaFabricDataGenerator.Pack pack = fabricDataGenerator.createPack();1
## Running Data Generation ​
To run datagen, use the run configuration in your IDE, or run ./gradlew runDatagen in the console. The generated files will be created in src/main/generated.

## Next Steps ​
Now that datagen is set up, we need to add providers. These are what generate the data to add to your Pack. The following pages outline how to do this.

- Advancements
- Loot Tables
- Recipes
- Tags
- Translations
- Block Models
- Item Models
Copied