import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;
const HASH_PREFIX = "scrypt";

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;

  return [HASH_PREFIX, salt.toString("hex"), derivedKey.toString("hex")].join(
    "$",
  );
}

export async function verifyPassword(password: string, encodedHash: string) {
  const [prefix, saltHex, hashHex, ...rest] = encodedHash.split("$");

  if (
    prefix !== HASH_PREFIX ||
    !saltHex ||
    !hashHex ||
    rest.length > 0 ||
    !/^[0-9a-f]+$/i.test(saltHex) ||
    !/^[0-9a-f]+$/i.test(hashHex)
  ) {
    return false;
  }

  const expected = Buffer.from(hashHex, "hex");
  if (expected.length !== KEY_LENGTH) return false;

  const actual = (await scrypt(
    password,
    Buffer.from(saltHex, "hex"),
    expected.length,
  )) as Buffer;

  return timingSafeEqual(actual, expected);
}
