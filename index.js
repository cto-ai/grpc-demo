const { sdk } = require('@cto.ai/sdk')

const PROTO_PATH = __dirname + '/helloworld.proto'
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    })

const hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld

/**
 * Implements the SayHello RPC method.
 */
 function sayHello(call, callback) {
  callback(null, {message: 'Hello there ' + call.request.name})
}

function sayHelloAgain(call, callback) {
  callback(null, {message: 'Hello again, ' + call.request.name})
}

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
 function main() {
  var server = new grpc.Server()
  server.addService(hello_proto.Greeter.service, {sayHello: sayHello, sayHelloAgain: sayHelloAgain})
  server.bindAsync('0.0.0.0:8080', grpc.ServerCredentials.createInsecure(), (err, port) => {
    server.start()
    if (err) {
      sdk.log('Error starting server: ', err)
    }
    sdk.log('Server started on port ' + port)
  })
}

main()