
# @owll/node-env-checker

The `@owll/node-env-checker` package is a command-line tool used to check format errors, duplicate keys, empty values, and required environment variables in `.env` files. The output can be in either JSON or Markdown format.

## Features

- Reports invalid formats, empty values, and duplicate keys in `.env` files.
- Checks for missing required environment variables.
- Outputs reports in JSON or Markdown format.

## Installation

You can install `@owll/node-env-checker` globally or as a project dependency.

### Global Installation

To install globally, use the following command:

```bash
npm install -g @owll/node-env-checker
```

### Project-based Installation

To install as a project dependency:

```bash
npm install @owll/node-env-checker --save-dev
```

Then, you can run the `@owll/node-env-checker` command:

```bash
npx @owll/node-env-checker
```

## Usage

### Basic Usage

By default, `@owll/node-env-checker` checks the `.env` files in the current directory for invalid formats, empty values, and duplicate keys.

```bash
npx @owll/node-env-checker
```

### Required Keys Check

If you want to check for specific required environment variables (keys), you can use the `--required` flag. This flag takes a comma-separated list of keys. Example usage:

```bash
npx @owll/node-env-checker --required DB_HOST,DB_USER,DB_PASS
```

This command will check for the specified keys in your `.env` files and report any missing ones.

### Report Formats

#### JSON Format

To get the report in JSON format, use the `--report json` flag:

```bash
npx @owll/node-env-checker --report json
```

The output might look like this:

```json
[
  {
    "file": ".env",
    "issues": [
      {
        "type": "INVALID_FORMAT",
        "line": 3,
        "content": "DB_HOST="
      },
      {
        "type": "DUPLICATE_KEY",
        "key": "DB_USER"
      },
      {
        "type": "EMPTY_VALUE",
        "key": "DB_PASS"
      }
    ]
  }
]
```

#### Markdown Format

To get the report in Markdown format, use the `--report md` flag:

```bash
npx @owll/node-env-checker --report md
```

The output might look like this:

```markdown
# Env File Report

## .env
✅ All variables are valid.

## .env.production
- ⚠️ **Invalid Format** (line 3): `DB_HOST=`
- ❌ **Repeat Key**: `DB_USER`
- ⚠️ **Empty Value**: `DB_PASS`
```

## Error Types

`@owll/node-env-checker` reports the following error types:

- **INVALID_FORMAT**: Invalid format for a key-value pair (e.g., `KEY=` instead of `KEY=VALUE`).
- **DUPLICATE_KEY**: A key appears multiple times.
- **EMPTY_VALUE**: A key has an empty value.
- **MISSING_REQUIRED**: A required key is missing.

## Other Commands

### Help

To view all available options:

```bash
npx @owll/node-env-checker --help
```

This command will provide information about all available options and parameters.

## Support

For support, you can reach out via [Buy Me A Coffee](https://buymeacoffee.com/yasindlklcc).

## License

This project is licensed under the MIT License.
