package com.mumfrey.webprefs.framework;

import java.net.Proxy;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

import net.minecraft.util.Session;

import com.mumfrey.liteloader.util.log.LiteLoaderLogger;
import com.mumfrey.webprefs.interfaces.IWebPreferencesClient;
import com.mumfrey.webprefs.interfaces.IWebPreferencesProvider;
import com.mumfrey.webprefs.interfaces.IWebPreferencesService;
import com.mumfrey.webprefs.interfaces.IWebPreferencesServiceMonitor;

public class WebPreferencesProvider extends Thread implements IWebPreferencesProvider, IWebPreferencesServiceMonitor
{
    private final IWebPreferencesService service;

    private final String hostName;

    private final Session session;

    private final int failureThreshold;

    private int failureCount = 0;

    private volatile boolean active = true;

    private final BlockingQueue<WebPreferencesServiceTask> tasks = new LinkedBlockingQueue<WebPreferencesServiceTask>(2048);

    public WebPreferencesProvider(Proxy proxy, Session session, String hostName, int maxFailedRequestsCount)
    {
        this.service = new WebPreferencesService(proxy, session);
        this.service.addMonitor(this);

        this.hostName = hostName;
        this.session = session;
        this.failureThreshold = maxFailedRequestsCount;

        this.setName("WebPreferencesProvider daemon thread [" + hostName + "]");
        this.setDaemon(true);
        this.start();
    }

    @Override
    public boolean isActive()
    {
        return this.active;
    }
    
    public void onTick()
    {
    }
    
    @Override
    public void run()
    {
        try
        {
            while (this.active)
            {
                WebPreferencesServiceTask task = this.tasks.take();
                try
                {
                    LiteLoaderLogger.debug("WebPreferencesProvider [%s] is processing %s for %s",  this.hostName,
                            task.getClass().getSimpleName(), task.getRequest().getUUID());
                    this.service.submit(task.getRequest());
                }
                catch (Throwable th)
                {
                    if (th instanceof InterruptedException) throw (InterruptedException)th;
                    th.printStackTrace();

                    this.onRequestFailed(th, 1);
                }
            }
        }
        catch (InterruptedException ex)
        {
            ex.printStackTrace();
        }
    }

    @Override
    public void onKeyRequestFailed()
    {
        this.registerError(this.failureThreshold / 2);
    }

    @Override
    public void onRequestFailed(Throwable th, int severity)
    {
        this.registerError(severity);
    }
    
    private void registerError(int severity)
    {
        this.failureCount += severity;
        if (this.failureCount >= this.failureThreshold)
        {
            LiteLoaderLogger.warning("WebPreferencesProvider for " + this.hostName + " is terminating. Too many failed requests.");
            this.active = false;
            this.tasks.clear();
            this.interrupt();
        }
    }
    
    @Override
    public boolean requestGet(IWebPreferencesClient client, String uuid, Set<String> keys, boolean getPrivate)
    {
        if (!this.isActive())
        {
            return false;
        }

        WebPreferencesServiceTask task = new WebPreferencesServiceTaskGet(this, client);
        task.setRequest(new WebPreferencesRequestGet(task, uuid, keys, getPrivate));
        return this.tasks.offer(task);
    }

    @Override
    public boolean requestSet(IWebPreferencesClient client, String uuid, Map<String, String> values, boolean setPrivate)
    {
        if (!this.isActive())
        {
            return false;
        }

        WebPreferencesServiceTask task = new WebPreferencesServiceTaskSet(this, client);
        task.setRequest(new WebPreferencesRequestSet(task, uuid, values, setPrivate));
        return this.tasks.offer(task);
    }

    @Override
    public String getHostName()
    {
        return this.hostName;
    }

    @Override
    public Session getSession()
    {
        return this.session;
    }

    @Override
    public IWebPreferencesService getService()
    {
        return this.service;
    }
}
