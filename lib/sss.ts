// Shamir Secret Sharing implementation
// This is a simplified version - in production, use a well-tested library

export interface Share {
  x: number;
  y: string; // Store as string to handle large numbers
}

// Prime number for finite field arithmetic (large enough for our use case)
const PRIME = BigInt("18446744073709551557"); // 2^64 - 59

export function generateShares(secret: string, n: number, t: number): Share[] {
  if (n < 2 || t < 2 || t > n) {
    throw new Error("Invalid parameters: n >= 2, t >= 2, and t <= n");
  }

  // Convert secret to BigInt
  const secretBytes = new TextEncoder().encode(secret);
  const secretHex = Array.from(secretBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  let secretNum = BigInt(0);
  if (secretHex) {
    secretNum = BigInt("0x" + secretHex) % PRIME;
  }

  // Generate random coefficients for polynomial
  const coefficients: bigint[] = [secretNum];
  for (let i = 1; i < t; i++) {
    // Generate random coefficient
    const randomBytes = crypto.getRandomValues(new Uint8Array(8));
    const randomNum = BigInt(
      "0x" +
        Array.from(randomBytes)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("")
    );
    coefficients.push(randomNum % PRIME);
  }

  // Generate shares
  const shares: Share[] = [];
  for (let x = 1; x <= n; x++) {
    let y = BigInt(0);
    const xBig = BigInt(x);
    for (let i = 0; i < t; i++) {
      const term = coefficients[i] * (xBig ** BigInt(i));
      y = (y + term) % PRIME;
    }
    shares.push({ x, y: y.toString() });
  }

  return shares;
}

export function reconstructSecret(shares: Share[], t: number): string {
  if (shares.length < t) {
    throw new Error(`Need at least ${t} shares to reconstruct`);
  }

  // Use Lagrange interpolation
  let secret = BigInt(0);
  const selectedShares = shares.slice(0, t);

  for (let i = 0; i < t; i++) {
    let numerator = BigInt(1);
    let denominator = BigInt(1);

    for (let j = 0; j < t; j++) {
      if (i !== j) {
        numerator = (numerator * BigInt(-selectedShares[j].x)) % PRIME;
        denominator =
          (denominator *
            (BigInt(selectedShares[i].x) - BigInt(selectedShares[j].x))) %
          PRIME;
      }
    }

    // Modular inverse for division
    const inv = modInverse(denominator, PRIME);
    const lagrange = (BigInt(selectedShares[i].y) * numerator * inv) % PRIME;
    secret = (secret + lagrange) % PRIME;
  }

  // Convert back to string
  const hex = secret.toString(16);
  const paddedHex = hex.length % 2 === 0 ? hex : "0" + hex;
  const hexPairs = paddedHex.match(/.{1,2}/g) || [];
  const bytes = new Uint8Array(hexPairs.map((byte) => parseInt(byte, 16)));
  return new TextDecoder().decode(bytes);
}

// Extended Euclidean Algorithm for modular inverse
function modInverse(a: bigint, m: bigint): bigint {
  let [oldR, r] = [a, m];
  let [oldS, s] = [BigInt(1), BigInt(0)];

  while (r !== BigInt(0)) {
    const quotient = oldR / r;
    [oldR, r] = [r, oldR - quotient * r];
    [oldS, s] = [s, oldS - quotient * s];
  }

  if (oldR > BigInt(1)) {
    throw new Error("Modular inverse does not exist");
  }

  return ((oldS % m) + m) % m;
}

