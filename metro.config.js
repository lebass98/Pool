const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const { resolver } = config;

// macOS의 resource fork 임시 파일(._*)을 번들링 대상에서 완전히 차단
config.resolver.blockList = [
  /.*\/._.*/,
  ...(resolver.blockList || []),
];

module.exports = config;
