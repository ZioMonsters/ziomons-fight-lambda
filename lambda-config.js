module.exports = env => ({
  Region: "eu-west-3",
  ConfigOptions: {
    FunctionName: `cryptomon-fight-lambda-${env}`,
    Description: "",
    Handler: "index.handler",
    RoleName: `cryptomon-fight-lambda-${env}`,
    MemorySize: 128,
    Timeout: 30,
    Runtime: "nodejs8.10",
    Environment: {
      Variables: {
        NODE_ENV: env
      }
    }
  }
})
