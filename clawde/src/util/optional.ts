/**
 * Lazy-loads an optional dependency.
 *
 * Connector SDKs (discord.js, telegraf, @slack/bolt, baileys, …) are declared
 * as *optional* dependencies so the core of Clawde always builds and runs even
 * if you have only configured one or two integrations. Each connector pulls in
 * its SDK through this helper at runtime.
 *
 * The module specifier is passed as a variable (not a string literal) on
 * purpose: that keeps the TypeScript compiler from trying to resolve the
 * module's types at build time, so `tsc` succeeds whether or not the package
 * is installed. If the package is missing at runtime we throw a friendly,
 * actionable error instead of a cryptic MODULE_NOT_FOUND.
 */
export async function loadOptional<T = any>(
  pkg: string,
  hint?: string,
): Promise<T> {
  const specifier = pkg; // indirection so tsc treats this as a dynamic import
  try {
    return (await import(specifier)) as T;
  } catch (err) {
    const install = hint ?? `npm install ${pkg}`;
    throw new Error(
      `Missing optional dependency "${pkg}". ` +
        `This integration needs it. Install it with:\n\n    ${install}\n`,
    );
  }
}

/** Returns true if an optional package can be imported, false otherwise. */
export async function hasOptional(pkg: string): Promise<boolean> {
  try {
    await loadOptional(pkg);
    return true;
  } catch {
    return false;
  }
}
