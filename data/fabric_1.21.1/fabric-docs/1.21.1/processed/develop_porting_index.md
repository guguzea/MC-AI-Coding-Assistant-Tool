
# Porting to 26.1 26.1.2 ​
Guidelines for porting to Minecraft 26.1, the latest version of Minecraft.The 26.1 version of Minecraft is unobfuscated, as were its snapshots. With this in mind, you'll need to make more changes to your build scripts than usual in order to port to it.

INFOThese docs discuss migrating from 1.21.11 to 26.1. If you're looking for another migration, switch to the target version by using the dropdown in the top-right corner.

## Prerequisites ​
If your mod is still using Fabric's Yarn Mappings, you'll first need to migrate your mod to Mojang's official mappings before porting to 26.1.

If you are using IntelliJ IDEA, you will also need to update it to 2025.3 or higher for full Java 25 support.

## Updating the Build Script ​
Start by updating your mod's gradle/wrapper/gradle-wrapper.properties, gradle.properties, and build.gradle to the latest versions. If you run into trouble, consider referencing the Fabric Example Mod.

1. Update Gradle to the latest version by running the following command: ./gradlew wrapper --gradle-version latest
2. Bump Minecraft, Fabric Loader, Fabric Loom and Fabric API, either in gradle.properties (recommended) or in build.gradle. Find the recommended versions of the Fabric components on the Fabric Develop site.
3. At the top of build.gradle, change the version of Loom you are using from id "fabric-loom" to id "net.fabricmc.fabric-loom". If you specify Loom in settings.gradle, change it there as well.
4. Remove the mappings line from the dependencies section of build.gradle.
5. Replace any instances of modImplementation, modCompileOnly or modApi with implementation, compileOnly and api.
6. Remove or replace any mods made for versions before 26.1 with versions compatible with this update. - No existing mods for 1.21.11 or older versions of Minecraft will work on 26.1, even as a compile-only dependency.
7. If needed, update the header of your access widener or class tweaker to replace named with official.
8. Set Java compatibility to 25 instead of 21.
9. Replace any mentions of remapJar with jar.
10. Refresh Gradle by using the refresh button in the top-right corner of IntelliJ IDEA. If this button is not visible, you can force caches to be cleared by running ./gradlew --refresh-dependencies.

## Updating the Code ​
After the build script has been updated to 26.1, you can now go through your mod and update any code that has changed to make it compatible with the snapshot.

- Fabric for Minecraft 26.1 on the Fabric blog contains a high-level explanation of the changes made to Fabric API in 26.1.
- Fabric API 26.1 Porting Guide lists the renames made to Fabric API in 26.1 snapshots to match Mojang's names.
- Java Edition 26.1 on the Minecraft Wiki is an unofficial summary of the contents of the update.
- NeoForge's Minecraft 1.21.11 -> 26.1 Mod Migration Primer covers migrating from 1.21.11 to 26.1, focusing only on vanilla code changes.
Copied