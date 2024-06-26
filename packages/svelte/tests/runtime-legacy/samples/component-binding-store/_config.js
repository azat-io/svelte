import { flushSync } from 'svelte';
import { test } from '../../test';

export default test({
	html: `
		<input />
		<input />
		<div></div>
	`,
	ssrHtml: `
		<input value=""/>
		<input value=""/>
		<div></div>
	`,

	test({ assert, component, target, window }) {
		let count = 0;
		component.callback = () => {
			count++;
		};

		const [input1, input2] = target.querySelectorAll('input');

		input1.value = '1';
		input1.dispatchEvent(new window.Event('input'));
		flushSync();

		assert.htmlEqual(
			target.innerHTML,
			`
				<input />
				<input />
				<div>1</div>
			`
		);
		assert.equal(input1.value, '1');
		assert.equal(input2.value, '1');
		assert.equal(count, 1);

		input2.value = '123';
		input2.dispatchEvent(new window.Event('input'));
		flushSync();

		assert.htmlEqual(
			target.innerHTML,
			`
				<input />
				<input />
				<div>123</div>
			`
		);
		assert.equal(input1.value, '123');
		assert.equal(input2.value, '123');
		assert.equal(count, 2);

		input1.value = '456';
		input1.dispatchEvent(new window.Event('input'));
		flushSync();

		assert.htmlEqual(
			target.innerHTML,
			`
				<input />
				<input />
				<div>456</div>
			`
		);
		assert.equal(input1.value, '456');
		assert.equal(input2.value, '456');
		assert.equal(count, 3);
	}
});
