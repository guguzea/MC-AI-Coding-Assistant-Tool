/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.core;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Properties;

import org.apache.commons.io.Charsets;
import org.apache.logging.log4j.core.Layout;
import org.apache.logging.log4j.core.Logger;
import org.apache.logging.log4j.core.appender.FileAppender;
import org.apache.logging.log4j.core.layout.PatternLayout;
import org.spongepowered.asm.mixin.MixinEnvironment;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.ImmutableMap.Builder;
import com.mumfrey.liteloader.api.LiteAPI;
import com.mumfrey.liteloader.api.manager.APIAdapter;
import com.mumfrey.liteloader.api.manager.APIProvider;
import com.mumfrey.liteloader.api.manager.APIRegistry;
import com.mumfrey.liteloader.common.LoadingProgress;
import com.mumfrey.liteloader.core.api.LiteLoaderCoreAPI;
import com.mumfrey.liteloader.core.api.repository.Repository;
import com.mumfrey.liteloader.interfaces.LoaderEnumerator;
import com.mumfrey.liteloader.launch.ClassTransformerManager;
import com.mumfrey.liteloader.launch.LiteLoaderTweaker;
import com.mumfrey.liteloader.launch.LoaderBootstrap;
import com.mumfrey.liteloader.launch.LoaderEnvironment;
import com.mumfrey.liteloader.launch.LoaderProperties;
import com.mumfrey.liteloader.launch.StartupEnvironment;
import com.mumfrey.liteloader.util.ObfuscationUtilities;
import com.mumfrey.liteloader.util.log.LiteLoaderLogger;
import com.mumfrey.liteloader.util.log.LiteLoaderLogger.Verbosity;

import net.minecraft.client.ClientBrandRetriever;
import net.minecraft.launchwrapper.ITweaker;
import net.minecraft.launchwrapper.LaunchClassLoader;

import com.mumfrey.liteloader.launch.LoaderEnvironment.EnvironmentType;

/**
 * LiteLoaderBootstrap is responsible for managing the early part of the
 * LiteLoader startup process, this is to ensure that NONE of the Minecraft
 * classes which by necessity the Loader references get loaded before the
 * PREINIT stage has completed. This allows us to load transforming tweakers in
 * the PREINIT stage without all hell breaking loose because class names have
 * changed between initialisation stages!
 * 
 * <p>This class handles setting up requisite resources like the logger,
 * enumerator and plug-in API modules and passes init calls through to the
 * LiteLoader instance at the appropriate points during startup. Because this
 * class is the first part of the loader to get loaded, we also keep central
 * references like the paths, version and loader properties in here.</p>
 *
 * @author Adam Mummery-Smith
 */
class LiteLoaderBootstrap implements LoaderBootstrap, LoaderEnvironment, LoaderProperties
{
    /**
     * Base game directory, passed in from the tweaker
     */
    private final File gameDirectory;

    /**
     * Assets directory, passed in from the tweaker 
     */
    private final File assetsDirectory;

    /**
     * Active profile, passed in from the tweaker 
     */
    private final String profile;

    /**
     * "Mods" folder to use
     */
    private final File modsFolder;

    /**
     * "Mods" folder to use
     */
    private final File versionedModsFolder;

    /**
     * Base "liteconfig" folder under which all other lite mod configs and
     * liteloader configs are placed. 
     */
    private final File configBaseFolder;

    /**
     * Folder containing version-independent configuration
     */
    private final File commonConfigFolder;

    /**
     * Folder containing version-specific configuration
     */
    private final File versionConfigFolder;
    
    /**
     * Mods repo file
     */
    private final String repositoryFile;
    
    /**
     * Mod repository defined in JSON
     */
    private final Repository repository;

    /**
     * File to write log entries to
     */
    private File logFile;

    /**
     * File containing the properties
     */
    private File propertiesFile;

    /**
     * JSON file containing the list of enabled/disabled mods by profile
     */
    private File enabledModsFile;

    /**
     * Internal properties loaded from inside the jar
     */
    private Properties internalProperties = new Properties();

    /**
     * LiteLoader properties
     */
    private Properties localProperties = new Properties();

    /**
     * Pack brand from properties, used to put the modpack/compilation name in
     * crash reports
     */
    private String branding = null;

    private boolean loadTweaks = true;

    private LaunchClassLoader classLoader; 

    private final StartupEnvironment env;

    private final ITweaker tweaker;

    private final APIRegistry apiRegistry;

    private final APIProvider apiProvider;

    private final APIAdapter apiAdapter;

    private final EnvironmentType environmentType;

    /**
     * The mod enumerator instance
     */
    private LiteLoaderEnumerator enumerator;

    /**
     * List of mods passed into the command line
     */
    private EnabledModsList enabledModsList;
    
    /**
     * @param env
     * @param tweaker
     */
    public LiteLoaderBootstrap(StartupEnvironment env, ITweaker tweaker)
    {
        this.environmentType     = EnvironmentType.values()[env.getEnvironmentTypeId()];
        this.env                 = env;
        this.tweaker             = tweaker;

        this.apiRegistry         = new APIRegistry(this.getEnvironment(), this.getProperties());

        this.gameDirectory       = env.getGameDirectory();
        this.assetsDirectory     = env.getAssetsDirectory();
        this.profile             = env.getProfile();
        this.modsFolder          = env.getModsFolder();
        this.repositoryFile      = env.getModsRepoFile();

        this.versionedModsFolder = new File(this.modsFolder,       LiteLoaderVersion.CURRENT.getMinecraftVersion());
        this.configBaseFolder    = new File(this.gameDirectory,    "liteconfig");
        this.logFile             = new File(this.configBaseFolder, "liteloader.log");
        this.propertiesFile      = new File(this.configBaseFolder, "liteloader.properties");
        this.enabledModsFile     = new File(this.configBaseFolder, "liteloader.profiles.json");

        this.commonConfigFolder  = new File(this.configBaseFolder, "common");
        this.versionConfigFolder = this.inflectVersionedConfigPath(LiteLoaderVersion.CURRENT);

        this.repository = new Repository(this.gameDirectory, this.versionedModsFolder);

        this.mkdir(this.modsFolder);
        this.mkdir(this.versionedModsFolder);
        this.mkdir(this.configBaseFolder);
        this.mkdir(this.commonConfigFolder);
        this.mkdir(this.versionConfigFolder);

        this.initAPIs(env.getAPIsToLoad());
        this.apiProvider = this.apiRegistry.getProvider();
        this.apiAdapter = this.apiRegistry.getAdapter();
    }

    private void mkdir(File dir)
    {
        if (!dir.isDirectory())
        {
            dir.mkdirs();
        }
    }

    /**
     * @param version
     */
    @Override
    public File inflectVersionedConfigPath(LiteLoaderVersion version)
    {
        if (version.equals(LiteLoaderVersion.LEGACY))
        {
            return this.modsFolder;
        }

        return new File(this.configBaseFolder, String.format("config.%s", version.getMinecraftVersion()));
    }

    /**
     * 
     */
    private void initAPIs(List<String> apisToLoad)
    {
        if (apisToLoad != null)
        {
            for (String apiClassName : apisToLoad)
            {
                this.registerAPI(apiClassName);
            }
        }

        this.apiRegistry.bake();
    }

    /**
     * @param apiClassName
     */
    public void registerAPI(String apiClassName)
    {
        this.apiRegistry.registerAPI(apiClassName);
    }

    @Override
    public APIProvider getAPIProvider()
    {
        return this.apiProvider;
    }

    @Override
    public APIAdapter getAPIAdapter()
    {
        return this.apiAdapter;
    }

    @Override
    public EnabledModsList getEnabledModsList()
    {
        return this.enabledModsList;
    }
    
    @Override
    public Repository getModRepository()
    {
        return this.repository;
    }

    @Override
    public LoaderEnumerator getEnumerator()
    {
        return this.enumerator;
    }

    @Override
    public EnvironmentType getType()
    {
        return this.environmentType;
    }

    @Override
    public LoaderEnvironment getEnvironment()
    {
        return this;
    }

    @Override
    public LoaderProperties getProperties()
    {
        return this;
    }

    @Override
    public boolean addCascadedTweaker(String tweakClass, int priority)
    {
        if (this.tweaker instanceof LiteLoaderTweaker)
        {
            return ((LiteLoaderTweaker)this.tweaker).addCascadedTweaker(tweakClass, priority);
        }

        return false;
    }

    @Override
    public ClassTransformerManager getTransformerManager()
    {
        if (this.tweaker instanceof LiteLoaderTweaker)
        {
            return ((LiteLoaderTweaker)this.tweaker).getTransformerManager();
        }

        return null;
    }

    /* (non-Javadoc)
     * @see com.mumfrey.liteloader.launch.ILoaderBootstrap
     *      #preInit(net.minecraft.launchwrapper.LaunchClassLoader, boolean)
     */
    @Override
    public void preInit(LaunchClassLoader classLoader, boolean loadTweaks)
    {
        List<String> modsToLoad = this.env.getModFilterList();

        this.classLoader = classLoader;
        this.loadTweaks = loadTweaks;

        LiteLoaderLogger.info(Verbosity.REDUCED, "LiteLoader begin PREINIT...");

        // Set up the bootstrap
        if (!this.prepare())
        {
            return;
        }

        LiteLoaderLogger.info(Verbosity.REDUCED, "LiteLoader %s starting up...", LiteLoaderVersion.CURRENT.getLoaderVersion());

        // Print the branding version if any was provided
        if (this.branding != null)
        {
            LiteLoaderLogger.info(Verbosity.REDUCED, "Active Pack: %s", this.branding);
        }

        LiteLoaderLogger.info(Verbosity.REDUCED, "Java reports OS=\"%s\"", System.getProperty("os.name").toLowerCase());

        this.enabledModsList = EnabledModsList.createFrom(this.enabledModsFile);
        this.enabledModsList.processModsList(this.profile, modsToLoad);
        
        this.enumerator = this.spawnEnumerator(classLoader);
        this.enumerator.onPreInit();
        
        this.initMixins();

        LiteLoaderLogger.info(Verbosity.REDUCED, "LiteLoader PREINIT complete");
    }

    private void initMixins()
    {
        LiteLoaderLogger.info(Verbosity.REDUCED, "Initialising LiteLoader Mixins");
        this.getAPIAdapter().initMixins();
    }

    /**
     * @param classLoader
     */
    protected LiteLoaderEnumerator spawnEnumerator(LaunchClassLoader classLoader)
    {
        return new LiteLoaderEnumerator(this, this, classLoader);
    }

    /* (non-Javadoc)
     * @see com.mumfrey.liteloader.launch.LoaderBootstrap#beginGame()
     */
    @Override
    public void preBeginGame()
    {
        LiteAPI api = this.getAPIProvider().getAPI("liteloader");
        if (api instanceof LiteLoaderCoreAPI)
        {
            ((LiteLoaderCoreAPI)api).getObjectFactory().preBeginGame();
        }

        LoadingProgress.setEnabled(this.getAndStoreBooleanProperty(LoaderProperties.OPTION_LOADING_BAR, true));
        
        if (ObfuscationUtilities.fmlIsPresent())
        {
            LiteLoaderLogger.info("FML detected, switching to searge mappings");
            MixinEnvironment.getDefaultEnvironment().setObfuscationContext("searge");
        }
    }

    /* (non-Javadoc)
     * @see com.mumfrey.liteloader.launch.ILoaderBootstrap
     *      #init(java.util.List, net.minecraft.launchwrapper.LaunchClassLoader)
     */
    @Override
    public void init()
    {
        // PreInit failed
        if (this.enumerator == null) return;

        LiteLoader.createInstance(this.getEnvironment(), this.getProperties(), this.classLoader);
        LiteLoader.invokeInit();
    }

    /* (non-Javadoc)
     * @see com.mumfrey.liteloader.launch.ILoaderBootstrap#postInit()
     */
    @Override
    public void postInit()
    {
        // PreInit failed
        if (this.enumerator == null) return;

        LiteLoader.invokePostInit();
    }

    /**
     * Set up reflection methods required by the loader
     */
    private boolean prepare()
    {
        try
        {
            // Prepare the properties
            this.prepareProperties();

            // Prepare the log writer
            this.prepareLogger();

            this.prepareBranding();
        }
        catch (Throwable th)
        {
            LiteLoaderLogger.severe(th, "Error initialising LiteLoader Bootstrap");
            return false;
        }

        return true;
    }

    /**
     * @throws SecurityException
     * @throws IOException
     */
    private void prepareLogger() throws SecurityException
    {
        LiteLoaderLogger.info("Setting up logger...");

        Logger logger = LiteLoaderLogger.getLogger();
        Layout<? extends Serializable> layout = PatternLayout.newBuilder()
            .withPattern("[%d{HH:mm:ss}] [%t/%level]: %msg%n")
            .withConfiguration(logger.getContext().getConfiguration())
            .withCharset(Charsets.UTF_8)
            .withAlwaysWriteExceptions(true)
            .build();
        FileAppender fileAppender = FileAppender.newBuilder()
            .withFileName(this.logFile.getAbsolutePath())
            .withAppend(false)
            .withLocking(false)
            .withName("LiteLoader")
            .withImmediateFlush(true)
            .withIgnoreExceptions(true)
            .withBufferedIo(true)
            .withLayout(layout)
            .withAdvertise(false)
            .setConfiguration(logger.getContext().getConfiguration())
            .build();
        fileAppender.start();
        logger.addAppender(fileAppender);
    }

    /**
     * Prepare the loader properties
     */
    private void prepareProperties()
    {
        LiteLoaderLogger.info("Initialising Loader properties...");

        try
        {
            InputStream propertiesStream = LiteLoaderBootstrap.class.getResourceAsStream("/liteloader.properties");

            if (propertiesStream != null)
            {
                this.internalProperties.load(propertiesStream);
                propertiesStream.close();
            }
        }
        catch (Throwable th)
        {
            this.internalProperties = new Properties();
        }

        try
        {
            this.localProperties = new Properties(this.internalProperties);
            InputStream localPropertiesStream = this.getLocalPropertiesStream();

            if (localPropertiesStream != null)
            {
                this.localProperties.load(localPropertiesStream);
                localPropertiesStream.close();
            }
        }
        catch (Throwable th)
        {
            this.localProperties = new Properties(this.internalProperties);
        }
    }

    /**
     * Get the properties stream either from the jar or from the properties file
     * in the minecraft folder
     * 
     * @throws FileNotFoundException
     */
    private InputStream getLocalPropertiesStream() throws FileNotFoundException
    {
        if (this.propertiesFile.exists())
        {
            return new FileInputStream(this.propertiesFile);
        }

        // Otherwise read settings from the config
        return LiteLoaderBootstrap.class.getResourceAsStream("/liteloader.properties");
    }

    /**
     * Write current properties to the properties file
     */
    @Override
    public void writeProperties()
    {
        try
        {
            this.localProperties.store(new FileWriter(this.propertiesFile), String.format("Properties for LiteLoader %s", LiteLoaderVersion.CURRENT));
        }
        catch (Throwable th)
        {
            LiteLoaderLogger.warning(th, "Error writing liteloader properties");
        }
    }

    /**
     * 
     */
    private void prepareBranding()
    {
        this.branding = this.internalProperties.getProperty(LoaderProperties.OPTION_BRAND, null);
        if (this.branding != null && this.branding.length() < 1)
        {
            this.branding = null;
        }

        // Save appropriate branding in the local properties file
        if (this.branding != null)
        {
            this.localProperties.setProperty(LoaderProperties.OPTION_BRAND, this.branding);
        }
        else
        {
            this.localProperties.remove(LoaderProperties.OPTION_BRAND);
        }
    }

    /**
     * Get the game directory
     */
    @Override
    public File getGameDirectory()
    {
        return this.gameDirectory;
    }

    /**
     * Get the assets directory
     */
    @Override
    public File getAssetsDirectory()
    {
        return this.assetsDirectory;
    }

    /**
     * Get the profile directory
     */
    @Override
    public String getProfile()
    {
        return this.profile;
    }

    /**
     * Get the mods folder
     */
    @Override
    public File getModsFolder()
    {
        return this.modsFolder;
    }

    /**
     * Get the mods folder
     */
    @Override
    public File getVersionedModsFolder()
    {
        return this.versionedModsFolder;
    }

    /**
     * Get the base "liteconfig" folder
     */
    @Override
    public File getConfigBaseFolder()
    {
        return this.configBaseFolder;
    }

    /**
     * Get the common configuration folder
     */
    @Override
    public File getCommonConfigFolder()
    {
        return this.commonConfigFolder;
    }

    /**
     * Get the versioned configuration folder
     */
    @Override
    public File getVersionedConfigFolder()
    {
        return this.versionConfigFolder;
    }
    
    /**
     * Get the path to a JSON file describing a mod repository layout, can be
     * null if not defined
     */
    @Override
    public String getModsRepoFile()
    {
        return this.repositoryFile;
    }

    /**
     * Get a boolean propery from the properties file and also write the new
     * value back to the properties file.
     * 
     * @param propertyName
     * @param defaultValue
     */
    @Override
    public boolean getAndStoreBooleanProperty(String propertyName, boolean defaultValue)
    {
        boolean result = this.localProperties.getProperty(propertyName, String.valueOf(defaultValue)).equalsIgnoreCase("true");
        this.localProperties.setProperty(propertyName, String.valueOf(result));
        return result;
    }

    /**
     * Get a boolean propery from the properties file and also write the new
     * value back to the properties file.
     * 
     * @param propertyName
     */
    @Override
    public boolean getBooleanProperty(String propertyName)
    {
        return this.localProperties.getProperty(propertyName, "false").equalsIgnoreCase("true");
    }

    /**
     * Set a boolean property
     * 
     * @param propertyName
     * @param value
     */
    @Override
    public void setBooleanProperty(String propertyName, boolean value)
    {
        this.localProperties.setProperty(propertyName, String.valueOf(value));
    }

    @Override
    public int getAndStoreIntegerProperty(String propertyName, int defaultValue)
    {
        int result = LiteLoaderBootstrap.tryParseInt(this.localProperties.getProperty(propertyName, String.valueOf(defaultValue)), defaultValue);
        this.localProperties.setProperty(propertyName, String.valueOf(result));
        return result;
    }

    @Override
    public int getIntegerProperty(String propertyName)
    {
        return LiteLoaderBootstrap.tryParseInt(this.localProperties.getProperty(propertyName, "0"), 0);
    }

    @Override
    public void setIntegerProperty(String propertyName, int value)
    {
        this.localProperties.setProperty(propertyName, String.valueOf(value));
    }

    /**
     * Store current revision for mod in the config file
     * 
     * @param modKey
     */
    @Override
    public void storeLastKnownModRevision(String modKey)
    {
        if (this.localProperties != null)
        {
            this.localProperties.setProperty(modKey, String.valueOf(LiteLoaderVersion.CURRENT.getLoaderRevision()));
            this.writeProperties();
        }
    }

    /**
     * Get last know revision for mod from the config file 
     * 
     * @param modKey
     */
    @Override
    public int getLastKnownModRevision(String modKey)
    {
        if (this.localProperties != null)
        {
            String storedRevision = this.localProperties.getProperty(modKey, "0");
            return Integer.parseInt(storedRevision);
        }

        return 0;
    }

    /* (non-Javadoc)
     * @see com.mumfrey.liteloader.launch.LoaderEnvironment#loadTweaksEnabled()
     */
    @Override
    public boolean loadTweaksEnabled()
    {
        return this.loadTweaks;
    }

    /**
     * Used to get the name of the modpack being used
     * 
     * @return name of the modpack in use or null if no pack
     */
    @Override
    public String getBranding()
    {
        return this.branding;
    }
    
    /**
     * Check that the branding was applied and if not, attempt to set it in the
     * fml branding directly using reflection
     */
    @SuppressWarnings("unchecked")
    static void onStartupComplete()
    {
        try
        {
            // If this field exists, the mixin was successfully applied so we can stop
            
            try
            {
                ClientBrandRetriever.class.getDeclaredField("BRANDING_LITELOADER");
                return;
            }
            catch (NoSuchFieldException ex)
            {
                // Field doesn't exist so the mixin was not applied
            }
            
            // Get loader
            Class<?> clLoader = Class.forName("net.minecraftforge.fml.common.Loader");
            
            // Get instance
            Object instance = clLoader.getMethod("instance").invoke(null);
            
            // Get branding properties
            Map<String, String> properties = (Map<String, String>)clLoader.getMethod("getFMLBrandingProperties").invoke(instance);
            
            // Retrieve the current snooper branding
            String branding = properties.get("snooperbranding");
            
            // If it's blank, set ourself, if it's already set then append ourself
            branding = branding == null ? "LiteLoader" : branding + ",LiteLoader";
            
            // Find the field in Loader
            Field fdProperties = clLoader.getDeclaredField("fmlBrandingProperties");
            fdProperties.setAccessible(true);
            
            // Build a new immutable property set, but remove any existing
            // snooperbranding because the immutable map builder doesn't like
            // duplicate keys!
            Builder<String, String> newProperties = ImmutableMap.<String, String>builder();
            for (Entry<String, String> property : properties.entrySet())
            {
                if (!"snooperbranding".equals(property.getKey()))
                {
                    newProperties.put(property);
                }
            }
            
            newProperties.put("snooperbranding", branding);
            
            // Set new properties into field
            fdProperties.set(instance, newProperties.build());
        }
        catch (Exception ex)
        {
            LiteLoaderLogger.info("Unable to apply snooper branding, servers will not receive LiteLoader in branding packets from this client: %s %s",
                    ex.getClass().getName(), ex.getMessage());
        }
    }

    /* (non-Javadoc)
     * @see com.mumfrey.liteloader.launch.LoaderBootstrap
     *      #getRequiredTransformers()
     */
    @Override
    public List<String> getRequiredTransformers()
    {
        return this.getAPIAdapter().getRequiredTransformers();
    }

    /* (non-Javadoc)
     * @see com.mumfrey.liteloader.launch.LoaderBootstrap
     *      #getRequiredDownstreamTransformers()
     */
    @Override
    public List<String> getRequiredDownstreamTransformers()
    {
        List<String> requiredDownstreamTransformers = this.getAPIAdapter().getRequiredDownstreamTransformers();
        requiredDownstreamTransformers.add(0, "com.mumfrey.liteloader.transformers.event.EventTransformer");
        return requiredDownstreamTransformers;
    }

    private static int tryParseInt(String string, int defaultValue)
    {
        try
        {
            return Integer.parseInt(string);
        }
        catch (NumberFormatException ex)
        {
            return defaultValue;
        }
    }
}
