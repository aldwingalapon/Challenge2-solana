// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmRawTransaction,
    sendAndConfirmTransaction
} = require("@solana/web3.js");

const MY_DEMO_FROM_SECRET_KEY = new Uint8Array(
    [
        36, 246, 178,  33,  50,  84, 133, 240, 133,  58, 178,
        16,   2, 108, 236, 196, 209, 117, 149,   5,  77, 248,
        219, 159,  15,  41,  29, 215, 241,  43, 231,  29,  26,
        98,  52, 232, 198, 228,   3, 180,  96, 185,  45, 115,
        166, 113, 147, 187, 218, 106, 167,  18,  80, 197,  84,
        104,  94, 224,  97, 119, 149, 148, 192, 217
    ]            
);

// Get Keypair from Secret Key
var from = Keypair.fromSecretKey(MY_DEMO_FROM_SECRET_KEY);

// Extract the public and private key from the sender keypair
const frompublicKey = new PublicKey(from._keypair.publicKey).toString();
const fromprivateKey = from._keypair.secretKey;
var fromBalance = 0;

// Generate another Keypair (account we'll be sending to)
const to = Keypair.generate();

// Extract the public and private key from the recipient keypair
const topublicKey = new PublicKey(to._keypair.publicKey).toString();
const toprivateKey = to._keypair.secretKey;
var toBalance = 0;

// Get the wallet balance from a given private key
const getWalletBalance = async () => {
    try {
        // Connect to the Devnet
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        //console.log("Connection object is:", connection);

        // Make a wallet (keypair) from sender keypair and get its balance
        const fromWallet = await Keypair.fromSecretKey(fromprivateKey);
        const fromwalletBalance = await connection.getBalance(
            new PublicKey(from.publicKey)
        );
        fromBalance = fromwalletBalance;

        // Make a wallet (keypair) from recipient keypair and get its balance
        const toWallet = await Keypair.fromSecretKey(toprivateKey);
        const towalletBalance = await connection.getBalance(
            new PublicKey(to.publicKey)
        );
        toBalance = towalletBalance;

        console.log(`from Wallet balance: ${parseInt(fromBalance) / LAMPORTS_PER_SOL} SOL`);
        console.log(`to Wallet balance: ${parseInt(toBalance) / LAMPORTS_PER_SOL} SOL`);
    } catch (err) {
        console.log(err);
    }
};

// 
const transferSol = async() => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Transfer 50% balance from sender wallet and into recipient wallet
    var transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to.publicKey,
            lamports: 0.5 * fromBalance
        })
    );

    // Sign transaction
    var signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
    );
    console.log('Signature is ', signature);

}

// 
const mainFunction = async () => {
    await getWalletBalance();
    await transferSol();
    await getWalletBalance();
}

mainFunction();