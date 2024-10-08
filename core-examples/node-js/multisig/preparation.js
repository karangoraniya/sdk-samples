const { TonClient } = require("@eversdk/core");
const { libNode } = require("@eversdk/lib-node");
const { SafeMultisigContract, prepareSignerWithRandomKeys } = require("./utils");

// Link the platform-dependable ever-sdk binary with the target Application in Typescript
// This is a Node.js project, so we link the application with `libNode` binary
// from `@eversdk/lib-node` package
// If you want to use this code on other platforms, such as Web or React-Native,
// use  `@eversdk/lib-web` and `@eversdk/lib-react-native` packages accordingly
// (see README in  https://github.com/tonlabs/ever-sdk-js )
TonClient.useBinaryLibrary(libNode);

// Create a project on https://dashboard.evercloud.dev and pass
// its Development Network HTTPS endpoint as a parameter:
const HTTPS_DEVNET_ENDPOINT = process.argv[2] 

if (HTTPS_DEVNET_ENDPOINT === undefined) {
    throw new Error("HTTPS endpoint required")
}

(async () => {
    try {
        const client = new TonClient({
            network: {
                endpoints: [ HTTPS_DEVNET_ENDPOINT ],
            },
        });

        const signer = await prepareSignerWithRandomKeys(client);

        // Generate future address of the contract. It is unique and the same per key pair and contract to be deployed.
        // Encode deploy message
        const { address } = await client.abi.encode_message({
            abi: SafeMultisigContract.abi,
            deploy_set: {
                tvc: SafeMultisigContract.tvc,
                initial_data: {},
            },
            signer
        });
        console.log("Your keys have been saved in the file './keyPair.json' and will be used later to work with your multisig wallet.");
        console.log(`Here is the future address of your contract, please top-up this account:`);
        console.log(`Raw address: ${address}`);
        convertedAddress = (await client.utils.convert_address({
            address,
            output_format: {
                type: "Base64",
                url: false,
                test: false,
                bounce: false,
            },
        })).address;
        console.log(`Address in non-bounce Base64: ${convertedAddress}`);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();
