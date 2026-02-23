import { styleText as st } from 'node:util';
import type {
	InspectColorBackground,
	InspectColorForeground,
	InspectColorModifier
} from 'node:util';
import prettyjson from 'prettyjson';

class ClogBuilder {
	private _color: InspectColorForeground | InspectColorBackground = 'white';
	private _modifiers: InspectColorModifier[] = [];
	private _timed: boolean = false;
	private _overwrite: boolean = false;
	private _lastWasOverwrite: boolean = false;

	private _print(text: number | string | object): this {
		const str =
			typeof text === 'object'
				? prettyjson.render(text)
				: typeof text === 'number'
					? st(this._color, text.toString(), { validateStream: false })
					: text;

		const output = `${this._timed ? `[${new Date().toTimeString().slice(0, 8)}]${typeof text === 'object' ? '\n' : ' - '}` : ''}${str}`;

		const formats: (
			| InspectColorForeground
			| InspectColorBackground
			| InspectColorModifier
		)[] = [this._color, ...this._modifiers];

		const styled = st(formats, output, { validateStream: false });

		if (this._lastWasOverwrite) {
			process.stdout.write('\r\x1B[2K');
		}

		if (this._overwrite) {
			process.stdout.write(styled);
			this._lastWasOverwrite = true;
		} else {
			console.log(styled);
			this._lastWasOverwrite = false;
		}

		this._color = 'white';
		this._modifiers = [];
		this._timed = false;
		this._overwrite = false;

		return this;
	}

	get red(): this {
		this._color = 'red';
		return this;
	}
	get green(): this {
		this._color = 'green';
		return this;
	}
	get yellow(): this {
		this._color = 'yellow';
		return this;
	}
	get blue(): this {
		this._color = 'blue';
		return this;
	}
	get magenta(): this {
		this._color = 'magenta';
		return this;
	}
	get cyan(): this {
		this._color = 'cyan';
		return this;
	}
	get white(): this {
		this._color = 'white';
		return this;
	}

	get bold(): this {
		this._modifiers.push('bold');
		return this;
	}
	get italic(): this {
		this._modifiers.push('italic');
		return this;
	}
	get underline(): this {
		this._modifiers.push('underline');
		return this;
	}
	get strikethrough(): this {
		this._modifiers.push('strikethrough');
		return this;
	}
	get dim(): this {
		this._modifiers.push('dim');
		return this;
	}
	get blink(): this {
		this._modifiers.push('blink');
		return this;
	}
	get inverse(): this {
		this._modifiers.push('inverse');
		return this;
	}
	get hidden(): this {
		this._modifiers.push('hidden');
		return this;
	}
	get timed(): this {
		this._timed = true;
		return this;
	}
	get ow(): this {
		this._overwrite = true;
		return this;
	}

	log(text: number | string | object): this {
		return this._print(text);
	}

	error(text: number | string | object): this {
		this._color = 'red';
		this._modifiers.push('bold');
		this._modifiers.push('inverse');
		return this._print(text);
	}

	success(text: number | string | object): this {
		this._color = 'blue';
		this._modifiers.push('bold');
		this._modifiers.push('inverse');
		return this._print(text);
	}

	warning(text: number | string | object): this {
		this._color = 'yellow';
		return this._print(text);
	}

	sep(a?: number | string, b?: number | string): this {
		const length = typeof a === 'number' ? a : typeof b === 'number' ? b : 25;
		const char = typeof a === 'string' ? a : typeof b === 'string' ? b : '-';
		return this._print(char.repeat(length));
	}
}

type Cloggi = ClogBuilder & ((text: number | string | object) => void);

const wrapInstance = (instance: ClogBuilder): Cloggi => {
	return new Proxy(
		function (text: number | string | object) {
			(instance as any).log(text);
		},
		{
			get(_target, prop) {
				const val = (instance as any)[prop];
				if (val instanceof ClogBuilder) return wrapInstance(val);
				if (typeof val === 'function') return val.bind(instance);
				return val;
			}
		}
	) as unknown as Cloggi;
};

export const cloggi = wrapInstance(new ClogBuilder());
