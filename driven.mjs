import kleur from "kleur";
import readline from "readline";

const encode = JSON.stringify;
const tests = {};

readline.emitKeypressEvents(process.stdin);

function executeTests(stdin) {
  const printTestResult = test => err => {
    const txt =
      (err ? kleur.red().bold("✘ ") : kleur.green().bold("✓ ")) +
      test +
      (err ? kleur.red("\n" + err.message) : "");

    stdin.write(txt + "\n");
  };

  for (let test in tests) {
    const print = printTestResult(test);

    try {
      const res = tests[test]();
      if (!res) print();
      else res.then(print).catch(print);
    } catch (err) {
      print(err);
    }
  }
}

export function run() {
  const stdin = process.openStdin();
  stdin.setRawMode(true);

  stdin.on("keypress", function(_, key) {
    if (key && /\r/.test(key.sequence)) executeTests(stdin);
    if (key && key.ctrl && key.name == "c") process.exit();
  });

  executeTests(stdin);
}

export function it(msg, fn) {
  tests[msg] = fn;
}

export function expect(actual) {
  return {
    toBe: expected => {
      if (actual === expected) return;
      const err = errorFactory(expected, actual);
      throw err;
    },
    toEqual: expected => {
      if (encode(actual) == encode(expected)) return;
      const err = errorFactory(expected, actual);
      throw err;
    }
  };
}

function errorFactory(expected, actual) {
  return new Error(
    `    Expected: ${encode(expected)} \n    Actual:   ${encode(actual)}`
  );
}
