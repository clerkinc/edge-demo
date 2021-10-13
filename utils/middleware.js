import { jwtVerify } from 'jose/jwt/verify';
import { importJWK } from 'jose/key/import';
import { parseJwk } from "jose/jwk/parse";

export default function requireSession(handler) {
    return async function(req, res, next) {
        try {
            const cookieToken = req.cookies['__session'];
            console.log(`cookieToken: ${cookieToken}`);

            let headerToken;
            if (req.headers) {
                headerToken = (req.headers['Authorization'] || req.headers['authorization'])
                console.log(`headerToken: ${headerToken}`);
            }

            let sessionClaims;

            if (headerToken) {
                sessionClaims = await verifyToken(headerToken);
                console.log('1', sessionClaims)
            }

            // Try to verify token from cookie only if header is empty or failed to verify
            if (!sessionClaims && cookieToken) {
                sessionClaims = await verifyToken(cookieToken);
                console.log('2', sessionClaims)
            }

            if (!sessionClaims) {
                throw new Error('Missing session token')
            }

            // @ts-ignore
            req.session = {id: sessionClaims.sid, userId: sessionClaims.sub};

            // next();
            handler(req, res, next)
        } catch (error) {
            console.log('Error', error)
            res.status(500).send(error)
        }
    }
}

async function verifyToken(token) {
    if (!token) {
        console.log('empty token received! halting...');
        return;
    }

    console.log('token being verified: ', token)

    try {
        const key = await parseJwk(
            {
                use: "sig",
                kty: "RSA",
                kid: "ins_1yiuq1D9zppc0osRtGth9mOtqur",
                alg: "RS256",
                n: "8VSJjOvDOndfVcTnxX5FRjVXo2SrhWkaa10EaC5o9yqGFE-lFSNJD6eZd5fgdPlMu9RgeGoiKma9xd5-9XyL-Nq7qhxQw-jXxoUlwLOXbXuvJ0MRF7hdPJvqhCSyBpgbi0-Br8HAyeJ8lsqPxp4-WxiXuguHjgz35OkyONPKg1rOFlGYq1EaJU4mUXncSj9AyjZP2-pQkn4LSJIFo4vuLzK59UobLr2P6-I9z_ib_mFUqwMVZbQWa_PqorGPvhYuJJKXE2KASamJ6224F-S3C8rWAEk4ylUXyh1CjhVzsbw4lb155goJ-4DR4Hj3pRtSiuGTXfsa_f__7bsiyBIR4w",
                e: "AQAB"
            },
            "RS256"
        );

        console.log('crypto.subtle.importKey(): ', key)

        // This hack should make jwtVerify work
        globalThis.CryptoKey = key.constructor;

        // verify the token
        const { payload } = await jwtVerify(token, key, {algorithms: ['RS256']})
        console.log('jose.jwtVerify(): ', payload)

        if (!payload.iss || !(payload.iss?.lastIndexOf('https://clerk.', 0) === 0)) {
            throw new Error(`Invalid issuer: ${payload.iss}`)
        }

        return payload
    } catch (e) {
        console.log('verify token error', e)
        throw new Error(e)
    }
}

function convertPemToBinary(pem) {
    let lines = pem.split('\n')
    let encoded = ''
    for(let i = 0;i < lines.length;i++){
        if (lines[i].trim().length > 0 &&
            lines[i].indexOf('-BEGIN RSA PRIVATE KEY-') < 0 &&
            lines[i].indexOf('-BEGIN RSA PUBLIC KEY-') < 0 &&
            lines[i].indexOf('-END RSA PRIVATE KEY-') < 0 &&
            lines[i].indexOf('-END RSA PUBLIC KEY-') < 0) {
            encoded += lines[i].trim()
        }
    }
    return base64StringToArrayBuffer(encoded)
}

function base64StringToArrayBuffer(b64str) {
    const byteStr = atob(b64str)
    const bytes = new Uint8Array(byteStr.length)
    for (let i = 0; i < byteStr.length; i++) {
        bytes[i] = byteStr.charCodeAt(i)
    }
    return bytes.buffer
}

async function retrieveJWK() {
    try {
        const pubKey = process.env.CLERK_PUBLIC_KEY.replace(/\\n/g, '\n');
        if (!pubKey) {
            throw new Error('Missing public key')
        }

        console.log(pubKey)

        // fetch the part of the PEM string between header and footer
        const pemHeader = "-----BEGIN PUBLIC KEY-----";
        const pemFooter = "-----END PUBLIC KEY-----";
        const pemContents = pubKey.substring(pemHeader.length, pubKey.length - pemFooter.length);
        console.log(pemContents)
        // base64 decode the string to get the binary data
        const binaryDerString = atob(pemContents);
        console.log('after atob')
        // convert from a binary string to an ArrayBuffer
        const binaryDer = str2ab(binaryDerString);

        console.log('before crypto import key', binaryDer)

        const key = await crypto.subtle.importKey(
            'spki',
            binaryDer,
            {
                name: 'RSASSA-PKCS1-v1_5',
                hash: 'SHA-256'
            },
            true,
            ['verify']
        );

        console.log('after crypto import key', key)

        return crypto.subtle.exportKey('jwk', key);
    } catch (e) {
        console.log('retrieve jwk error', e)
        throw new Error(e)
    }
}

// Convert a string into an ArrayBuffer from https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

