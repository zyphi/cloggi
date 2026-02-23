# cloggi

## Installation

```bash
npm install cloggi
```

## Usage

```typescript
import { cloggi } from 'cloggi';

// Call directly as a function
cloggi('Hello, World!');

// Colors
cloggi.red('This is red text');
cloggi.green('This is green text');
cloggi.yellow('This is yellow text');
cloggi.blue('This is blue text');
cloggi.magenta('This is magenta text');
cloggi.cyan('This is cyan text');
cloggi.white('This is white text');

// Modifiers
cloggi.bold('This is bold text');
cloggi.italic('This is italic text');
cloggi.underline('This is underlined text');
cloggi.strikethrough('This is strikethrough text');
cloggi.dim('This is dim text');
cloggi.blink('This is blinking text');
cloggi.inverse('This is inverse text');

// Semantic helpers
cloggi.log('This is plain text');
cloggi.error('Something went wrong');
cloggi.success('Operation completed');
cloggi.warning('Proceed with caution');

// Chain colors and modifiers
cloggi.red.bold('This is bold red text');
cloggi.blue.bold.inverse('This is blue bold inverse text');

// Prepend timestamp [HH:MM:SS]
cloggi.timed('This message has a timestamp');
cloggi.timed.green('Timed green message');

// Pass objects — rendered with prettyjson
cloggi({ key: 'value', nested: { a: 1 } });
cloggi.timed.error({ code: 500, message: 'Something went wrong' });

// Separator line
cloggi.sep(); // ------------------------- (25 dashes, default)
cloggi.sep(10); // ---------- (10 dashes)
cloggi.sep('_'); // _________________________ (25 underscores)
cloggi.sep(10, '_'); // __________ (10 underscores)
cloggi.sep('=', 10); // ========== (any order works)
cloggi.red.sep(20); // colored separator
```
