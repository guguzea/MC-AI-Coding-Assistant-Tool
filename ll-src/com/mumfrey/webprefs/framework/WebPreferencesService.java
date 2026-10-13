package com.mumfrey.webprefs.framework;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.Proxy;
import java.net.URI;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import net.minecraft.util.Session;

import org.apache.commons.io.IOUtils;

import com.google.common.base.Charsets;
import com.google.gson.Gson;
import com.mumfrey.liteloader.util.log.LiteLoaderLogger;
import com.mumfrey.webprefs.exceptions.InvalidRequestException;
import com.mumfrey.webprefs.exceptions.InvalidResponseException;
import com.mumfrey.webprefs.interfaces.IWebPreferencesRequest;
import com.mumfrey.webprefs.interfaces.IWebPreferencesResponse;
import com.mumfrey.webprefs.interfaces.IWebPreferencesService;
import com.mumfrey.webprefs.interfaces.IWebPreferencesServiceMonitor;

class WebPreferencesService implements IWebPreferencesService
{
    private static final int TIMEOUT_MSEC = 5000;

    private final Proxy proxy;
    
    private final Session session;

    private final Map<String, String> serverKeys = new HashMap<String, String>();

    private final List<IWebPreferencesServiceMonitor> monitors = new ArrayList<IWebPreferencesServiceMonitor>();

    private long lastMojangAuth = 0L;

    WebPreferencesService(Proxy proxy, Session session)
    {
        this.proxy = proxy;
        this.session = session;
    }

    @Override
    public void addMonitor(IWebPreferencesServiceMonitor monitor)
    {
        if (!this.monitors.contains(monitor))
        {
            this.monitors.add(monitor);
        }
    }
    
    void handleKeyRequestFailed(Throwable th)
    {
        LiteLoaderLogger.debug(th, "Key request failed with message %s", th.getMessage());

        for (IWebPreferencesServiceMonitor monitor : this.monitors)
        {
            monitor.onKeyRequestFailed();
        }
    }

    void handleKeyRequestCompleted(IWebPreferencesResponse response)
    {
    }

    @Override
    public void submit(IWebPreferencesRequest request)
    {
        try
        {
            this.beginProcessingRequest(request);
        }
        catch (InvalidRequestException ex)
        {
            request.getDelegate().onRequestFailed(request, ex, ex.getReason());
        }
    }
    
    private IWebPreferencesResponse beginProcessingRequest(IWebPreferencesRequest request) throws InvalidRequestException
    {
        LiteLoaderLogger.debug("WebPreferencesService is processing %s for %s", request.getClass().getSimpleName(), request.getUUID());
        
        if (request.isValidationRequired())
        {
            String requestClass = request.getClass().getSimpleName();

            Session session = request.getDelegate().getSession();
            if (session == null)
            {
                throw new InvalidRequestException(RequestFailureReason.NO_SESSION,
                        "Validation is required for " + requestClass + " but no session was provided.");
            }
            
            String serverId = this.getServerIdForRequest(request);

            if (!this.registerServerConnection(session, serverId))
            {
                throw new InvalidRequestException(RequestFailureReason.NO_SESSION,
                        "Validation is required for " + requestClass + " but no session was provided or session validation failed");
            }
        }

        return this.processRequest(request);
    }
    
    private IWebPreferencesResponse processRequest(IWebPreferencesRequest request)
    {
        try
        {
            String data = this.httpPost(request.getRequestURI(), request.getPostVars());
            IWebPreferencesResponse response = WebPreferencesResponse.fromJson(data);
            
            LiteLoaderLogger.debug("Response: %s", response);
            request.onReceivedResponse(response);

            request.getDelegate().onReceivedResponse(request, response);
            return response;
        }
        catch (InvalidResponseException ex)
        {
            request.getDelegate().onRequestFailed(request, ex, ex.getReason());

            for (IWebPreferencesServiceMonitor monitor : this.monitors)
            {
                monitor.onRequestFailed(ex, ex.getReason().getSeverity());
            }
        }
        catch (IOException ex)
        {
            request.getDelegate().onRequestFailed(request, ex, RequestFailureReason.SERVER_ERROR);

            for (IWebPreferencesServiceMonitor monitor : this.monitors)
            {
                monitor.onRequestFailed(ex, RequestFailureReason.SERVER_ERROR.getSeverity());
            }
        }
        catch (Exception ex)
        {
            for (IWebPreferencesServiceMonitor monitor : this.monitors)
            {
                monitor.onRequestFailed(ex, RequestFailureReason.UNKNOWN.getSeverity());
            }
        }

        return null;
    }

    private String getServerIdForRequest(IWebPreferencesRequest request)
    {
        if (request.getDelegate().getSession() == null)
        {
            return null;
        }

        String hostName = request.getDelegate().getHostName();
        String serverId = this.serverKeys.get(hostName);

        if (serverId == null)
        {
            LiteLoaderLogger.info("Looking up server ID for " + hostName);
            WebPreferencesRequestKey keyRequest = new WebPreferencesRequestKey(this, this.session, hostName);
            IWebPreferencesResponse response = this.processRequest(keyRequest);
            if (response == null || response.getServerId() == null)
            {
                throw new InvalidRequestException(RequestFailureReason.SERVER_ERROR, "Could not retrieve server ID for " + hostName);
            }

            serverId = response.getServerId();
            this.serverKeys.put(hostName, serverId);

            LiteLoaderLogger.info("Got server ID for " + hostName + " [" + serverId + "]");
        }

        return serverId;
    }
    
    public String httpPost(URI uri, Map<String, String> params) throws IOException
    {
        String query = this.buildQuery(params);
        byte[] queryBytes = query.getBytes(Charsets.UTF_8);
        
        LiteLoaderLogger.debug("Connecting to " + uri);
        HttpURLConnection http = (HttpURLConnection)uri.toURL().openConnection(this.proxy);
        http.setConnectTimeout(WebPreferencesService.TIMEOUT_MSEC);
        http.setReadTimeout(WebPreferencesService.TIMEOUT_MSEC);
        http.setUseCaches(false);
        http.setDoOutput(true);

        http.addRequestProperty("Content-type", "application/x-www-form-urlencoded");
        http.setRequestProperty("Content-Length", "" + queryBytes.length);

        OutputStream outputStream = null;

        try
        {
            outputStream = http.getOutputStream();
            IOUtils.write(queryBytes, outputStream);
        }
        finally
        {
            IOUtils.closeQuietly(outputStream);
        }

        try
        {
            String debugMessages = http.getHeaderField("X-Debug-Message");
            if (debugMessages != null)
            {
                String[] messages = new Gson().fromJson(debugMessages, String[].class);
                for (String message : messages)
                {
                    LiteLoaderLogger.debug("[SERVER] %s", message);
                }
            }
        }
        catch (Exception ex) {}

        InputStream inputStream = null;

        try
        {
            try
            {
                inputStream = http.getInputStream();
                String response = IOUtils.toString(inputStream, Charsets.UTF_8);
                return response;
            }
            catch (IOException ex)
            {
                IOUtils.closeQuietly(inputStream);
                inputStream = http.getErrorStream();
                if (inputStream == null)
                {
                    return this.formatErrorAsJson(http.getResponseCode() + " " + http.getResponseMessage(), ex.getMessage());
                }

                String response = IOUtils.toString(inputStream, Charsets.UTF_8);

                String contentType = http.getHeaderField("Content-type");
                if (!"application/json".equals(contentType))
                {
                    System.err.println(response);
                    return this.formatErrorAsJson(http.getResponseCode() + " " + http.getResponseMessage(), "Invalid content type " + contentType);
                }

                return response;
            }
        }
        finally
        {
            IOUtils.closeQuietly(inputStream);
        }
    }
    
    private String formatErrorAsJson(String response, String message)
    {
        return String.format("{\"response\":\"%s\",\"message\":\"%s\"}", response, message);
    }
    
    private String buildQuery(Map<String, String> params)
    {
        StringBuilder sb = new StringBuilder();
        
        try
        {
            String separator = "";
            for (Entry<String, String> postValue : params.entrySet())
            {
                sb.append(separator).append(postValue.getKey()).append("=").append(URLEncoder.encode(postValue.getValue(), "UTF-8"));
                separator = "&";
            }
        }
        catch (UnsupportedEncodingException ex)
        {
            ex.printStackTrace();
        }

        return sb.toString();
    }
    
    private boolean registerServerConnection(Session session, String serverId)
    {
        if (session == null || serverId == null)
        {
            return false;
        }

        if (System.currentTimeMillis() - this.lastMojangAuth < 300000L)
        {
            LiteLoaderLogger.debug("Mojang connection is still fresh, using existing ticket");
            return true;
        }

        try
        {
            LiteLoaderLogger.debug("Creating Mojang session ticket...");
            URL checkServerUrl = new URL("http://session.minecraft.net/game/joinserver.jsp?user=" + URLEncoder.encode(session.func_111285_a(), "UTF-8") + "&sessionId=" + URLEncoder.encode(session.func_111286_b(), "UTF-8") + "&serverId=" + URLEncoder.encode(serverId, "UTF-8"));
            BufferedReader responseReader = new BufferedReader(new InputStreamReader(checkServerUrl.openStream()));
            String response = responseReader.readLine();
            responseReader.close();
            boolean joinSuccess = "OK".equals(response);
            if (joinSuccess)
            {
                this.lastMojangAuth = System.currentTimeMillis();
                return true;
            }
        }
        catch (IOException ex)
        {
            ex.printStackTrace();
            LiteLoaderLogger.debug("Failed to log on to invoke joinserver, connection to mojang failed");
            throw new InvalidRequestException(RequestFailureReason.SERVER_ERROR, "Failed registering server connection with Mojang");
        }

        return false;
    }
}
