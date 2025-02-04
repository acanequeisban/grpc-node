/*
 *
 * Copyright 2015 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */


var messages = require('./helloworld_pb');
var services = require('./helloworld_grpc_pb');

var grpc = require('@grpc/grpc-js');
const fs = require('fs');
const { Buffer } = require('buffer');
const { BinaryConstants } = require('google-protobuf');
var __dirname = "/workspace/grpc-node/examples/helloworld";

const root_cert = fs.readFileSync(__dirname +  '/credentials/caRoot.crt'); 
var sub_cert = fs.readFileSync(__dirname +  '/credentials/caSub.crt'); 
var ca_bundle = fs.readFileSync(__dirname +  '/credentials/caBundle.crt'); 
var localhost_cert = new Buffer.from(fs.readFileSync(__dirname +  '/credentials/localhosttest.crt','binary')); 
var localhost_key = new Buffer.from(fs.readFileSync(__dirname +  '/credentials/localhosttest.key','binary')); 
//var localhost_key = new Buffer("null","binary");
console.log(localhost_cert);
console.log(localhost_key);

/*var _ca = "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";
var _cert = "MIIDtTCCAp2gAwIBAgIEXINfwjANBgkqhkiG9w0BAQsFADCBkjELMAkGA1UEBhMCRVMxHjAcBgNVBAoMFVNhbnRhbmRlciBHbG9iYWwgVGVjaDEkMCIGA1UECwwbQ1RPIC0gU2VjdXJpdHkgQXJjaGl0ZWN0dXJlMT0wOwYDVQQDDDRDVE8gLSBTZWN1cml0eSBBcmNoaXRlY3R1cmUgU3Vib3JkaW5hdGUgSSBDQSBQcmltYXJ5MB4XDTE5MDMwOTA2NDAwMloXDTI5MDMwOTA2NDAwMlowZzELMAkGA1UEBhMCRVMxHjAcBgNVBAoMFVNhbnRhbmRlciBHbG9iYWwgVGVjaDEkMCIGA1UECwwbQ1RPIC0gU2VjdXJpdHkgQXJjaGl0ZWN0dXJlMRIwEAYDVQQDDAlsb2NhbGhvc3QwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDPWaADH63rP7xu6qtfXp4C1ORFoYx5FIfT7bEvXaCN8rbh9IC7jnEKUuqMPWpjNU6hYyxikfyJnsGUNmlf3WOjZApxjn4mqaUlgqiP0h0n7NHA3ftBYcbjv0FdZHIPOyOnTRPolZbLs3TiZpM4ZaKA5VbkSfwxtB9WKJlKTvmoB4KkxFRrDXrvczlSkUMoPzCXIchBE6Or5+zfUhNJuCnK5M8drdV23v4cIHRVUIpRz999Y07lJ3cE4XrvgYchBWvDrzlEeSaRWw6ZN5JCStRuzQ6urVyN8ioxsylQdJQcmXqUIrTAb+oKiRcZ8RKD2VyLCq55NcZYvyHZroYlFt51AgMBAAGjPTA7MA4GA1UdDwEB/wQEAwIFoDAUBgNVHREEDTALgglsb2NhbGhvc3QwEwYDVR0lBAwwCgYIKwYBBQUHAwEwDQYJKoZIhvcNAQELBQADggEBADnPrFIlFy5up+Dw7aOpXCxriDciaULlSERRyQxP5iRkBbyLBvBDv/rYXgK/jCui3KSeodFg/F9Hia3scvKuZ/lONackWEVvvM9J2X0B7iV05A0uY4PBpFrOynZVjLje1dTIEMungKstuMqPzwDZbnv2+k/2VU+J4BcAkJtPnqO+Qkq4d5xsqkvcGRmUYvJb1G6bUhlpiuyPpwpC9MbxHqBiTH05FpW69U6o4b1N+Z3tjhIutwzo5jhsodEHlsGmsMyibANJoPNiNi2vRA0BA77q+hIbXI4aCAcwQs0lZZq7ExTxbIiu5tC72le0Ex6y6E9q8LsrFzam03SLSIS/YSE=";
var _key = "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDPWaADH63rP7xu6qtfXp4C1ORFoYx5FIfT7bEvXaCN8rbh9IC7jnEKUuqMPWpjNU6hYyxikfyJnsGUNmlf3WOjZApxjn4mqaUlgqiP0h0n7NHA3ftBYcbjv0FdZHIPOyOnTRPolZbLs3TiZpM4ZaKA5VbkSfwxtB9WKJlKTvmoB4KkxFRrDXrvczlSkUMoPzCXIchBE6Or5+zfUhNJuCnK5M8drdV23v4cIHRVUIpRz999Y07lJ3cE4XrvgYchBWvDrzlEeSaRWw6ZN5JCStRuzQ6urVyN8ioxsylQdJQcmXqUIrTAb+oKiRcZ8RKD2VyLCq55NcZYvyHZroYlFt51AgMBAAECggEACE6n7tgbE1zCA5OapWnYsiEDZZgbqlIx6uy6ojzXDOOCLjqp2a8oROieMFuEN/tPw37XWA+klYLrGzFe4WdbnD/gJz01PVP4o4XA6RowRC7kbHINpJ3ykPdS+sHmdp5rnEKl9Is3DRbggkg9HQ+oBg//fjVJ9FfUwD1E1EmmY56ZnSQ/+YkfQCxQ9iVCxICunwbNBe0aixAVOPolwOFZi0xiRn9kH9JCXG64ne1TtVw+c751snyGiujj/5WmKxx4G7FU8T8v/d+PSr7T7ct2JGwHaxmHBGnNBjRCRv5i8NibdEhtJAVEnvPx7Id0FzoALOC55nEgLghZd2OrSWxqdQKBgQDpmowjUXWIQFu+CjpOKsTT5LeE37AGJ3PaduHOgcPqEvNxL/8fj1RDpFe6V3jRvdoxiWjbgB0K/EfDNDAQ6kChsNNRrntdY2TWAXuXY1S85NSCTaWue+za8i0kQ0fO+fG7bgEek2qbn67FkszXYqyns7QAmMjStKmBxzL91EhAmwKBgQDjOrjpZOLIeHgwADOCIHgCkjtULUeeq9CBdBo0CoDdu9mNvz2NEGvu89PN2cYDAA7q5CCHpbGAAs5HVX+iqhSWUYILzJQCNecoWHptZ3RTrLqWR2SeHmu9CBV9y7A0hYfmc6eS8oOR7iD8GuF7L2aMlf3IHrmXIaTmdaA5RHQmLwKBgGjIxzWMc5EDdWOASPkJHDMD9AHpKJcKGWCUVOOBt7SGfaZ25hRtAVo6HJPcariCVZ5EycEz7VMhKLt57FmaChW9MH0CLBoO3ItWLO8SQk9cwaoVVE05D1yCpxcOCubfnLv7MwtZCsf1z7qWB8ZRX6r147ck0WgaW7J3/Pp4v1QjAoGBAMFGcYIUDdH2pkQt56IHfAyz1UMEQKb1/aQe3SrmxDXWUnX+9JvIHAZj3wR497QVmJqy7/hxN0lrGYoTbz0s7dXt/m+K01oN/1CR8ZCdLpT9lre8ghj8RyfCeIVHe9kwuyeJuD+Fh+PYaLYHJ0NgThnGetZ9S98A/wIHiwEq+KCBAoGAFqoRFZ777j6G8HpmUklq1xItNss9KQ6UG9gyCqaLcM8LYVT49aJqpxKju7uEtcLtI66npLjCflxuJslhH9hdP37cky759rZikcz1V3TLXqVXM9BGNwnT9ZD+qDtEdrrnwR4tt14fpqHSzZwwpB9GwHRhrIMGBSqweJY6ZZvZ3c4=";
*/
var _credentials = grpc.ServerCredentials;

/**
 * Implements the SayHello RPC method.
 */
function sayHello(call, callback) {
  var reply = new messages.HelloReply();
  reply.setMessage('Hello ' + call.request.getName());
  callback(null, reply);
}

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  var server = new grpc.Server();
  server.addService(services.GreeterService, {sayHello: sayHello});
  /*server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
  });*/

  localhost_key2 = new Buffer (localhost_key,"binary");
  console.log(localhost_key2);

   server.bindAsync('0.0.0.0:50051', _credentials.createSsl(root_cert,[{localhost_cert,localhost_key}],false), () => {
    server.start();
  });
}

main();
