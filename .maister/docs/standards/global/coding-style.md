## Coding Style

### Naming Consistency
Follow established naming patterns for variables, functions, classes, and files throughout the project.

### Automatic Formatting
Use automated tools to enforce consistent indentation, spacing, and line breaks.

### Descriptive Names
Choose names that clearly communicate intent; avoid cryptic abbreviations or single-letter identifiers outside tight loops.

### Focused Functions
Write functions that do one thing well; smaller functions are easier to read, test, and maintain.

### EditorConfig Formatting
Formatting follows `.editorconfig` (root): UTF-8, LF line endings, 2-space indentation (no tabs), a final newline in every file, and no trailing whitespace except in Markdown, where two trailing spaces may mark a hard break. `.gitattributes` (`* text=auto eol=lf`) keeps LF in the repository, so never introduce CRLF, including on Windows.

### No Dead Code
Remove unused imports, commented-out blocks, and orphaned functions instead of leaving them behind.

### No Backward Compatibility Unless Required
Avoid extra code paths for backward compatibility unless explicitly needed.

### DRY (Don't Repeat Yourself)
Extract repeated logic into reusable functions or modules.
