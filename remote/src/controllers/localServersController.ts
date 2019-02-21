import * as express from 'express';
import { Body, Controller, Delete, Get, Header, Path, Post, Put, Request, Response, Route, Security, SuccessResponse, Tags } from 'tsoa';
import { ErrorResponse } from '../../../backend/src/models/sharedInterfaces';
import { ChannelsBlSingleton } from '../business-layer/channelsBl';
import { LocalServersBlSingleton } from '../business-layer/localServersBl';
import { LocalServersSessionBlSingleton } from '../business-layer/localServersSessionsBl';
import { LocalServer } from '../models/sharedInterfaces';

@Tags('Servers')
@Route('servers')
export class LocalServersController extends Controller {

    /**
     * Get local servers in system.
     */
    @Security('adminAuth')
    @Response<ErrorResponse>(501, 'Server error')
    @Get()
    public async getLocalServers(): Promise<LocalServer[]> {
        return await LocalServersBlSingleton.getlocalServers();
    }

    /**
     * Get local server by it`s id.
     */
    @Security('adminAuth')
    @Response<ErrorResponse>(501, 'Server error')
    @Get('{localServerId}')
    public async getLocalServer(localServerId: string): Promise<LocalServer> {
        return await LocalServersBlSingleton.getlocalServersById(localServerId);
    }

    /**
     * Add new local server to system.
     */
    @Security('adminAuth')
    @Response<ErrorResponse>(501, 'Server error')
    @Post()
    public async addLocalServer(@Body() localServer: LocalServer): Promise<void> {
        return await LocalServersBlSingleton.createLocalServer(localServer);
    }

    /**
     * Update local server properties.
     * @param localServerId local server to update.
     * @param localServer new properties object to set.
     */
    @Security('adminAuth')
    @Response<ErrorResponse>(501, 'Server error')
    @Put('{localServerId}')
    public async updateLocalServer(localServerId: string, @Body() localServer: LocalServer): Promise<void> {
        localServer.localServerId = localServerId;
        return await LocalServersBlSingleton.updateLocalServer(localServer);
    }

    /**
     * Remove local server from system.
     * @param localServerId local server to remove.
     */
    @Security('adminAuth')
    @Response<ErrorResponse>(501, 'Server error')
    @Delete('{localServerId}')
    public async deleteLocalServer(localServerId: string): Promise<void> {
        await LocalServersBlSingleton.deleteLocalServer(localServerId);
        /** After local server removed, remove session too. */
        await LocalServersSessionBlSingleton.deleteLocalServerSession(localServerId);
    }

    /**
     * Generate new authentication key for local server.
     * (delete current key if exsit).
     *
     * KEEP GENERATED KEY PRIVATE AND SECURE,
     * PUT IT IN YOUR LOCAL SERVER AND NEVER SHOW IT TO ANYBODY!!!
     * @param localServerId local server to generate for.
     */
    @Security('adminAuth')
    @Response<ErrorResponse>(501, 'Server error')
    @Post('auth/{localServerId}')
    public async generateAuthKeyLocalServer(localServerId: string): Promise<string> {
        return await LocalServersSessionBlSingleton.generateLocalServerSession(localServerId);
    }

    /**
     * Get all user names from local server.
     * Used to allow admin select users that can access their local server via remote.
     * @param localServerId local server to get users from.
     */
    @Security('adminAuth')
    @Response<ErrorResponse>(501, 'Server error')
    @Get('local-users/{localServerId}')
    public async getLocalServerUsers(localServerId: string): Promise<string[]> {
        return await ChannelsBlSingleton.getLocalServerUsers(localServerId);
    }
}