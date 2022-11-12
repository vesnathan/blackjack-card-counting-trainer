
var serverlessSDK = require('./serverless_sdk/index.js');
serverlessSDK = new serverlessSDK({
  orgId: 'vesnathan',
  applicationName: 'blackjack',
  appUid: 'HTsjSyS8YPDBLRZ4cz',
  orgUid: '1148429b-dd9f-46a8-a186-9e9ba192d45e',
  deploymentUid: '763de9ab-79ee-48e7-a466-8e2f2283150f',
  serviceName: 'blackjack',
  shouldLogMeta: true,
  shouldCompressLogs: true,
  disableAwsSpans: false,
  disableHttpSpans: false,
  stageName: 'dev',
  serverlessPlatformStage: 'prod',
  devModeEnabled: false,
  accessKey: null,
  pluginVersion: '6.2.2',
  disableFrameworksInstrumentation: false
});

const handlerWrapperArgs = { functionName: 'blackjack-dev-graphql', timeout: 6 };

try {
  const userHandler = require('./src/apollo-server.js');
  module.exports.handler = serverlessSDK.handler(userHandler.graphqlHandler, handlerWrapperArgs);
} catch (error) {
  module.exports.handler = serverlessSDK.handler(() => { throw error }, handlerWrapperArgs);
}