module.exports = {
    webpack5: true,
    webpack: (config) => {
        config.resolve.fallback = { fs: false, path: false, crypto: false, stream: false, os: false, http: false, https: false, constants: false, platform: false, prototype: false };

        return config;
    },
};