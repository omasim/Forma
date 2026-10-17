# Security policy

## Supported versions

| Version | Supported |
|---|---|
| 6.x | Yes |
| 5.x | No. Please upgrade (`npx @nage/forma lint --fix`) |

## Reporting a vulnerability

Please do not open a public issue. Report it privately through [GitHub security advisories](https://github.com/omasim/Forma/security/advisories/new) with the version, a minimal reproduction and the impact you see. You'll get an answer within 7 days; fixes ship as a patch release with a credited advisory.

## Scope

FORMA's JavaScript never inserts user-provided text as HTML. The exceptions are explicit and documented: `Forma.chat().add({ html })` is for trusted, already-sanitised markup only. The CSS, the MCP server and the CLI make no network requests, except `forma fonts`, which downloads font packages from the npm registry when you run it.
