#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const minimist = require('minimist');

const argv = minimist(process.argv.slice(2));
const reportType = argv.report; // 'json' | 'md'
const requiredEnvVars = argv.required ? argv.required.split(',') : []; 

// Help command
if (argv.help) {
    console.log(`
Usage: env-checker [options]

Options:
  --report <json|md>    Specify the format of the report. Options: 'json' or 'md'. Default is plain output.
  --required <key1,key2,key3>    Specify comma-separated list of required environment variables.
  --help                Show this help message and exit.

Description:
  The env-checker tool checks the validity of .env files in the current directory.
  It reports issues such as invalid format, duplicate keys, empty values, and missing required environment variables.

Examples:
  npx env-checker                      Check all .env files and show the report in plain format.
  npx env-checker --report json         Show the report in JSON format.
  npx env-checker --required DB_HOST,DB_USER   Check if the required environment variables are present in the .env files.
  npx env-checker --report md --required DB_HOST,DB_PASS  Check and show the report in Markdown format with required variables.

`);
    process.exit(0);
}

const envFiles = fs.readdirSync(process.cwd()).filter(file =>
    file.startsWith('.env') && fs.statSync(file).isFile()
);

if (envFiles.length === 0) {
    console.log(chalk.red('❌ No .env files were found.'));
    process.exit(1);
}

let fullReport = [];

envFiles.forEach(file => {
    const fullPath = path.resolve(process.cwd(), file);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const lines = content.split('\n');

    const keys = new Set();
    const fileReport = {
        file,
        issues: []
    };

    lines.forEach((line, index) => {
        const trimmed = line.trim();

        if (!trimmed || trimmed.startsWith('#')) return;

        const [key, ...rest] = trimmed.split('=');
        const value = rest.join('=');

        if (!key) {
            fileReport.issues.push({
                type: 'INVALID_FORMAT',
                line: index + 1,
                content: line
            });
            return;
        }

        if (keys.has(key)) {
            fileReport.issues.push({
                type: 'DUPLICATE_KEY',
                key
            });
            return;
        }

        if (value === '') {
            fileReport.issues.push({
                type: 'EMPTY_VALUE',
                key
            });
        }

        keys.add(key);
    });

    if (requiredEnvVars.length > 0) {
        requiredEnvVars.forEach(requiredKey => {
            if (!keys.has(requiredKey)) {
                fileReport.issues.push({
                    type: 'MISSING_REQUIRED',
                    key: requiredKey
                });
            }
        });
    }

    fullReport.push(fileReport);
});

if (!reportType) {
    fullReport.forEach(report => {
        console.log(chalk.blue(`\n🔍 Checking ${report.file}:`));

        if (report.issues.length === 0) {
            console.log(chalk.green('  ✅ All variables are valid.'));
        } else {
            report.issues.forEach(issue => {
                if (issue.type === 'INVALID_FORMAT') {
                    console.log(chalk.yellow(` ⚠️ INVALID FORMAT (line ${issue.line}): ${issue.content}`));
                } else if (issue.type === 'DUPLICATE_KEY') {
                    console.log(chalk.red(` ❌ REPEATING VARIABLE: ${issue.key}`));
                } else if (issue.type === 'EMPTY_VALUE') {
                    console.log(chalk.yellow(` ⚠️ NULL VALUE: ${issue.key}`));
                } else if (issue.type === 'MISSING_REQUIRED') {
                    console.log(chalk.red(` ❌ MISSING REQUIRED VARIABLE: ${issue.key}`));
                }
            });
        }
    });
}

// 📤 JSON 
if (reportType === 'json') {
    console.log('\n' + JSON.stringify(fullReport, null, 2));
}

// 📝 Markdown 
if (reportType === 'md') {
    let md = `# Env File Report\n`;

    fullReport.forEach(report => {
        md += `\n## ${report.file}\n`;
        if (report.issues.length === 0) {
            md += `✅ All variables are valid.\n`;
        } else {
            report.issues.forEach(issue => {
                if (issue.type === 'INVALID_FORMAT') {
                    md += `- ⚠️ **Invalid Format** (line ${issue.line}): \`${issue.content}\`\n`;
                } else if (issue.type === 'DUPLICATE_KEY') {
                    md += `- ❌ **Repeat Key**: \`${issue.key}\`\n`;
                } else if (issue.type === 'EMPTY_VALUE') {
                    md += `- ⚠️ **Empty Value**: \`${issue.key}\`\n`;
                } else if (issue.type === 'MISSING_REQUIRED') {
                    md += `- ❌ **Missing Required Key**: \`${issue.key}\`\n`;
                }
            });
        }
    });

    console.log('\n' + md);
}
