/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.core.api;

import java.io.File;

import com.mumfrey.liteloader.interfaces.ModularEnumerator;
import com.mumfrey.liteloader.launch.LoaderEnvironment;
import com.mumfrey.liteloader.launch.LoaderProperties;
import com.mumfrey.liteloader.util.log.LiteLoaderLogger;

import com.mumfrey.liteloader.core.api.EnumeratorModuleFiles.ContainerEnvironment;

/**
 * Enumerator module which searches for mods and tweaks in a folder
 * 
 * @author Adam Mummery-Smith
 */
public class EnumeratorModuleFolder extends EnumeratorModuleFiles
{
    protected File directory;

    protected boolean readJarFiles;
    protected boolean loadTweaks;
    protected boolean forceInjection;

    /**
     * True if this is a versioned folder and the enumerator should also try to
     * load tweak jars which would normally be ignored.
     */
    protected final boolean loadTweakJars;

    public EnumeratorModuleFolder(LiteLoaderCoreAPI api, ContainerEnvironment containers, File directory, boolean loadTweakJars)
    {
        super(api, containers);
        this.directory = directory;
        this.loadTweakJars = loadTweakJars;
    }
    
    @Override
    public void init(LoaderEnvironment environment, LoaderProperties properties)
    {
        this.loadTweaks = properties.loadTweaksEnabled();
        this.readJarFiles = properties.getAndStoreBooleanProperty(LoaderProperties.OPTION_SEARCH_JARFILES, true);
        this.forceInjection = properties.getAndStoreBooleanProperty(LoaderProperties.OPTION_FORCE_INJECTION, false);

        this.api.writeDiscoverySettings();
    }

    /**
     * Write settings
     */
    @Override
    public void writeSettings(LoaderEnvironment environment, LoaderProperties properties)
    {
        properties.setBooleanProperty(LoaderProperties.OPTION_SEARCH_JARFILES, this.readJarFiles);
        properties.setBooleanProperty(LoaderProperties.OPTION_FORCE_INJECTION, this.forceInjection);
    }
    
    @Override
    protected boolean forceInjection()
    {
        return this.forceInjection;
    }
    
    @Override
    protected boolean loadTweakJars()
    {
        return this.loadTweakJars;
    }
    
    @Override
    protected boolean loadTweaks()
    {
        return this.loadTweaks;
    }
    
    @Override
    protected boolean readJarFiles()
    {
        return this.readJarFiles;
    }

    @Override
    protected File[] getFiles()
    {
        return this.directory.listFiles(this.getFilenameFilter());
    }

    /* (non-Javadoc)
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString()
    {
        return this.directory.getAbsolutePath();
    }

    /**
     * Get the directory this module will inspect
     */
    public File getDirectory()
    {
        return this.directory;
    }

    /* (non-Javadoc)
     * @see com.mumfrey.liteloader.core.Enumerator
     *      #enumerate(com.mumfrey.liteloader.core.EnabledModsList,
     *      java.lang.String)
     */
    @Override
    public void enumerate(ModularEnumerator enumerator, String profile)
    {
        if (this.directory.exists() && this.directory.isDirectory())
        {
            LiteLoaderLogger.info("Discovering valid mod files in folder %s", this.directory.getPath());
            this.findValidFiles(enumerator);
        }
    }
    
    /* (non-Javadoc)
     * @see com.mumfrey.liteloader.api.EnumeratorModule#register(
     *      com.mumfrey.liteloader.interfaces.ModularEnumerator,
     *      java.lang.String)
     */
    @Override
    public void register(ModularEnumerator enumerator, String profile)
    {
        if (this.directory.exists() && this.directory.isDirectory())
        {
            LiteLoaderLogger.info("Registering discovered mod files in folder %s", this.directory.getPath());
            this.sortAndRegisterFiles(enumerator);
        }
    }
}
