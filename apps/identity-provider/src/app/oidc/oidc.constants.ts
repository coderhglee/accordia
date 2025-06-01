export const OIDC_PROVIDER_MODULE = 'OIDC_PROVIDER_MODULE';
export const OIDC_PROVIDER = 'OIDC_PROVIDER';
export const OIDC_MODULE_OPTIONS = 'OIDC_MODULE_OPTIONS';

export type ESMOidcModule = typeof import('oidc-provider');

export interface OidcModuleOptions {
    issuer: string;
    oidc: any; // OIDC 설정
    path?: string;
    host?: string;
    version?: string;
    proxy?: boolean;
    factory?: OidcModuleFactoryFn;
}

export interface OidcModuleFactoryOptions {
    issuer: string;
    config: any;
    module: ESMOidcModule;
}

export type OidcModuleFactoryFn = (options: OidcModuleFactoryOptions) => any;

/**
 * Skip transpilation of import statement to require
 */
export const importOidcProvider = async (): Promise<ESMOidcModule> => {
    return eval('import("oidc-provider")');
};

/**
 * Validate and normalize the path
 */
export const validatePath = (path?: string): string => {
    if (!path) return '';

    // Remove leading and trailing slashes
    const normalizedPath = path.replace(/^\/+|\/+$/g, '');

    return normalizedPath;
}; 