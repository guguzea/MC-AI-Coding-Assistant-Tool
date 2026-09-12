# Getting Started

If you&rsquo;ve decided to contribute to Forge, you&rsquo;ll have to take some special steps to get started with developing. A simple mod development environment won&rsquo;t suffice to work with Forge&rsquo;s codebase directly. Instead, you can use the following guide to help you with your setup and get you started with improving Forge!

## Forking and Cloning the Repository

Like most major open source projects you&rsquo;ll find, Forge is hosted on [GitHub](https://www.github.com). If you&rsquo;ve contributed to another project before, you&rsquo;ll know this process already and you can skip right ahead to the next section.

For those who are beginners when it comes to collaboration via Git, here are only two easy to steps to get you started.


<!-- key:🔴 role:新手必读 (Note) -->

> **Note**: Note This guide assumes that you already have a GitHub account set up. If you don&rsquo;t, visit their registration page to create an account. Furthermore, this guide is not a tutorial for git&rsquo;s usage, please consult different sources first if you&rsquo;re struggling with getting it working.

### Forking

First of all, you have to &ldquo;fork&rdquo; the [MinecraftForge repository](https://www.github.com/MinecraftForge/MinecraftForge) by clicking the &ldquo;Fork&rdquo; button in the upper right hand corner. If you are in an organization, select the account you want your fork to be hosted on.

Forking the repository is necessary since not every GitHub user can have free access to every repository. Instead, you create a copy of the original repository to later contribute your changes via a so called Pull Request, which you will learn more about later.

### Cloning

After forking the repository, it is time to get local access to it and to actually make some changes. For this, you need to clone the repository onto your local machine.

Using your favourite git client, simply clone your fork into a directory of your choice. As general example, here is a command line snippet that should work on all correctly configured systems and clones the repository into a directory called &ldquo;Forge&rdquo; under the current directory (note that you have to replace `<User>` with your username):

`git clone https://github.com/<User>/MinecraftForge Forge`

# Checking out the Correct Branch

Forking and cloning the repository are the only mandatory steps to develop for Forge. However, to ease the process of creating Pull Requests for you, it is best to work with branches.

It is recommended to create and check out a branch for each PR you plan to submit. This way, you can always keep around the latest changes of Forge for new PRs while you still work on older patches.

After completing this step, you&rsquo;re ready to go and set up your development environment.

## Setting Up the Environment

Depending on your favourite IDE, there is a different set of recommended steps you have to follow to successfully set up a development environment.

### Eclipse

Due to the way eclipse workspaces work, ForgeGradle can do most of the work involved in getting you started with a Forge workspace for you.

1. <li>Open a terminal/command prompt and navigate it to the directory of your cloned fork.
2. <li>Type `./gradlew setupForge` and hit enter. Wait until ForgeGradle is done.
3. <li>Open your eclipse workspace and go to `File -> Import -> General -> Existing Projects into workspace`.
4. <li>Browse to the `<repo>/projects/` directory for the root directory in the dialog that opens.
5. <li>Make sure both &ldquo;Forge&rdquo; and &ldquo;Clean&rdquo; are checked and adjust the other settings to your liking.
6. <li>Complete the import by clicking the &ldquo;Finish&rdquo; button.

That&rsquo;s all it takes to get you up and running with Eclipse, there&rsquo;s no extra steps required to get test mods running. Simply hit Run like in any other project and select the appropriate run configuration.

### IntelliJ IDEA

JetBrains&rsquo; flagship IDE comes with great integrated support for [Gradle](https://www.gradle.org), Forge&rsquo;s build system of choice. Due to some peculiarities of Minecraft mod development, however, there are additional steps required to get everything to work properly.

If you&rsquo;re more of a visual person, cpw has uploaded [a video](https://www.youtube.com/watch?v=yanCpy8p2ZE) explaining very similar steps which will also lead to a working setup.


<!-- key:🔴 role:新手必读 (Note) -->

> **Note**: Note These steps will only work reliably from IDEA version 2016 onwards. Older versions didn&rsquo;t have the appropriate Gradle support and did not support Forge development workspaces.

1. <li>Import Forge&rsquo;s `build.gradle` as an IDEA project. For this, simply click `File -> Open`, then navigate to your fork&rsquo;s clone and select the `build.gradle` file. If a dialog pops up, select &ldquo;Open as Project&rdquo;.
2. <li>In the wizard that follows, make sure that &ldquo;Create separate module per source set&rdquo; is checked and that the &ldquo;Use default gradle wrapper&rdquo; option is active. Confirm the dialog.
3. <li>After IDEA is done importing the project and indexing the files, open the Gradle sidebar on the right hand side of your screen
4. <li>Open the &ldquo;forge&rdquo; project tree, select &ldquo;Tasks&rdquo;, then &ldquo;forgegradle&rdquo; and right click the &ldquo;Create Forge [setup]&rdquo; option
5. <li>Once the configuration dialog shows up, edit the &ldquo;tasks&rdquo; field to contain `clean setup` and add `-Xmx3G -Xms3G` to &ldquo;VM Options&rdquo;. The latter option ensures that the resource intensive decompilation process has enough memory.
6. <li>Click &ldquo;Okay&rdquo; and run your newly created run configuration. This may take a while.
7. <li>After the setup task has completed, go once again to the Gradle sidebar and click the &ldquo;Attach Gradle project&rdquo; button (the plus icon) at the top
8. <li>Navigate to your clone&rsquo;s directory, then open the `projects` directory and double click the `build.gradle` file in there. Select &ldquo;Use gradle wrapper task configuration&rdquo; in the following dialog and confirm it.
9. <li>Import all modules IDEA suggests
10. <li>To get access to the project&rsquo;s run configurations, open the `projects` directory in your file explorer and navigate to the `.idea` directory (might be hidden depending on your system). Copy the `runConfigurations` directory into `.idea` under your fork&rsquo;s root directory
11. <li>Once IDEA recognizes the added configurations, complete the following steps for each one- <li>Change the configuration&rsquo;s module to `<Config>_main` where `<Config>` is the first part of the configuration&rsquo;s name - <li>Change the run directory to `<clone>/projects/run`

That&rsquo;s all there is to creating a Forge development environment in IntelliJ IDEA. However, you won&rsquo;t be able to run the tests and debug mods included in Forge straight away. This takes some extra effort.

#### Enabling test mods

To enable the test mods coming with Forge, you will need to add the compiler output to the classpath. Again, cpw has put up [a video](https://www.youtube.com/watch?v=pLWQk6ed56Q) explaining these steps.

1. <li>Build the test classes by selecting the `src/main/test` directory in your project view and then run `Build -> Build module 'Forge_test'` from the menu bar.
2. <li>Open the &ldquo;Project Structure&rdquo; Window under `File -> Project Structure`.
3. <li>Head to the &ldquo;Modules&rdquo; section and expand the `Forge` module.
4. <li>Select the `Forge_test` submodule and head to the &ldquo;Paths&rdquo; tab.
5. <li>Remember the path listed under the &ldquo;Test output path&rdquo; label and select the `Forge_main` submodule from the tree.
6. <li>Open the &ldquo;Dependencies&rdquo; tab, hit the green plus button on the right-hand side and select &ldquo;JARs or directories&rdquo;.
7. <li>Navigate to the path previously displayed as the `Forge_test` output path and confirm your selection.
8. <li>For the &ldquo;Scope&rdquo; of this newly added dependency (currently &ldquo;Compile&rdquo;) choose &ldquo;Runtime&rdquo;, since the main code doesn&rsquo;t rely on the test code for compilation.

Now that you&rsquo;ve added the test mods to the classpath, you need to rebuild them each time you make a change as they will not be built automatically. To do so, repeat step 1 from the above list or, in case you make changes to a single test mod file and want them to get rebuild, simply hit `Build -> Rebuild project` or the corresponding keyboard shortcut (<kbd>CTRL+<kbd>F9 by default).

#### Testing with existing mods

You might want to test changes in Forge with an existing project. The video by cpw linked in the test mods section also covers this. Getting the mod to run requires similar steps to the test mod, but getting your project added to the workspace requires some additional work.

1. <li>Open the &ldquo;Project Structure&rdquo; Window under `File -> Project Structure`.
2. <li>Head to the &ldquo;Modules&rdquo; section and press the green plus icon above the tree view.
3. <li>Select &ldquo;Import Module&rdquo;, navigate to your project&rsquo;s `build.gradle` file and confirm your selection as well as the import settings.
4. <li>Close the &ldquo;Project Structure&rdquo; window by clicking the &ldquo;OK&rdquo; button.
5. <li>Reopen the window after IDEA is done importing the project and select your project&rsquo;s `_main` module from the tree.
6. <li>Open the &ldquo;Dependencies&rdquo; tab, click the green plus icon on the right-hand side and select &ldquo;Module dependency&rdquo;.
7. <li>In the window that just opened, select the `Forge_main` module.
8. <li>From here on, reproduce the steps from the test mods section, just with your project&rsquo;s `_main` module instead of the `Forge_test` one.


<!-- key:🔴 role:新手必读 (Note) -->

> **Note**: Note You might need to remove existing dependencies from a normal development environment (mainly references to a forgeSrc JAR) or move the Forge module higher up in the dependency list.

You should now be able to work with your mod using the changes you introduce to the Forge and Vanilla codebase.

## Making Changes and Pull Requests


<!-- key:🟠 role:常见错误 -->

Once you&rsquo;ve set up your development environment, it&rsquo;s time to make some changes to Forge&rsquo;s codebase. There are, however, some pitfalls you have to avoid when editing the project&rsquo;s code.

The most important thing to note is that if you wish to edit Minecraft source code, you must only do so in the &ldquo;Forge&rdquo; sub-project. Any changes in the &ldquo;Clean&rdquo; project will mess with ForgeGradle and generating the patches. This can have disastrous consequences and might render your environment completely useless. If you wish to have a flawless experience, make sure you only edit code in the &ldquo;Forge&rdquo; project!

### Generating Patches

After you&rsquo;ve made changes to the code base and once you&rsquo;ve tested them thoroughly, you may go ahead and generate patches. This is only necessary if you work on the Minecraft code base (i.e. in the &ldquo;Forge&rdquo; project), but this step is vital for your changes to work elsewhere. Forge works by injecting only changed things into Vanilla Minecraft and hence needs those changes available in an appopriate format. Thankfully, ForgeGradle is capable of generating the changeset for you and all you have to do is commit it.


<!-- key:🟠 role:常见错误 -->

To initiate the patch generation, simply run the `genPatches` Gradle task from your IDE or the command line. After its completion, you can commit all your changes (make sure you do not add any unnecessary files) and submit your Pull Request!

### Pull Requests

The last step before your contribution is added to Forge is a Pull Request (PR in short). This is a formal request to incorporate your fork&rsquo;s changes into the live code base. Creating a PR is easy, simply go to [this GitHub page](https://github.com/MinecraftForge/MinecraftForge/compare) and follow the proposed steps. It is now that a good setup with branches pays off, since you&rsquo;re able to select precisely the changes you want to submit.


<!-- key:🔴 role:新手必读 (Note) -->

> **Note**: Note Pull Requests are bound to rules, not every request will blindly be accepted. Follow this document to get further information and to ensure the best quality of your PR! If you want to maximize the chances of your PR getting accepted, follow these PR guidelines!