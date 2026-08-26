/**
 * Normalises whatever a client types into a bare domain name.
 *
 * Real clients paste what they see in a browser — "https://Example.LK",
 * "www.example.lk/", "example.lk." — and rejecting those on a strict pattern
 * blocks a paying customer over formatting. So instead of validating the shape
 * and refusing, this strips the parts that are never part of a registrable
 * domain and keeps the rest.
 *
 * Isomorphic on purpose: the same function runs in the browser (so the field
 * shows what will actually be saved) and in the server action (so a request
 * that bypasses the form is normalised identically).
 */
export function normaliseDomain(input: string): string {
  let value = input.trim().toLowerCase();

  // Any scheme — http://, https://, ftp://, and the "https:/" typo. At least
  // one slash is required: without it, "example.com:8080" looks like a scheme
  // and the host gets stripped instead of the port.
  value = value.replace(/^[a-z][a-z0-9+.-]*:\/{1,2}/, "");
  value = value.replace(/^\/+/, "");

  // Anything after the host: path, query string, fragment, port.
  value = value.split(/[/?#]/)[0] ?? "";
  value = value.split(":")[0] ?? "";

  // Registration applies to the apex, not the www host.
  value = value.replace(/^www\./, "");

  // Stray whitespace mid-string, a leading @, and the trailing root dot.
  value = value.replace(/\s+/g, "");
  value = value.replace(/^@+/, "");
  value = value.replace(/\.+$/, "");

  return value;
}
