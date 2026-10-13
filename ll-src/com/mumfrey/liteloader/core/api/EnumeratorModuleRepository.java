/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.core.api;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import com.mumfrey.liteloader.core.api.repository.Repository;
import com.mumfrey.liteloader.interfaces.ModularEnumerator;
import com.mumfrey.liteloader.util.log.LiteLoaderLogger;

import com.mumfrey.liteloader.core.api.EnumeratorModuleFiles.ContainerEnvironment;

/**
 * Enumerator module which searches for mods and tweaks in a folder
 * 
 * @author Adam Mummery-Smith
 */
public class EnumeratorModuleRepository extends EnumeratorModuleFiles
{
    private final File modList;
    
    private final Repository repo;
    
    private File[] files = new File[0];

    public EnumeratorModuleRepository(LiteLoaderCoreAPI api, ContainerEnvironment containers, Repository repo, File modList)
    {
        super(api, containers);
        this.repo = repo;
        this.modList = modList;
    }

    /* (non-Javadoc)
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString()
    {
        return this.modList.getAbsolutePath();
    }

    public File getModList()
    {
        return this.modList;
    }

    @Override
    protected boolean readJarFiles()
    {
        return true;
    }

    @Override
    protected boolean loadTweakJars()
    {
        return true;
    }

    @Override
    protected boolean loadTweaks()
    {
        return true;
    }

    @Override
    protected boolean forceInjection()
    {
        return false;
    }

    @Override
    protected File[] getFiles()
    {
        return this.files;
    }

    /* (non-Javadoc)
     * @see com.mumfrey.liteloader.core.Enumerator
     *      #enumerate(com.mumfrey.liteloader.core.EnabledModsList,
     *      java.lang.String)
     */
    @Override
    public void enumerate(ModularEnumerator enumerator, String profile)
    {
        if (this.modList.isFile())
        {
            LiteLoaderLogger.info("Discovering mod files defined in repository %s", this.modList.getPath());
            this.resolve();
            
            this.findValidFiles(enumerator);
        }
    }
    
    @Override
    public void register(ModularEnumerator enumerator, String profile)
    {
        if (this.modList.isFile())
        {
            LiteLoaderLogger.info("Discovering mod files defined in repository %s", this.modList.getPath());
            this.resolve();
            
            this.findValidFiles(enumerator);
            this.sortAndRegisterFiles(enumerator);
        }
    }

    private void resolve()
    {
        this.repo.resolve(this.modList);
        
        List<File> files = new ArrayList<File>();
        files.addAll(this.repo.getFiles());
        this.files = files.toArray(this.files);
    }
}
