import { execSync } from "child_process";
import kleur from "kleur";
import readline from "readline";

const encode = JSON.stringify;
const tests = {};

readline.emitKeypressEvents(process.stdin);

function executeTests() {
  const printTestResult = test => err => {
    const txt =
      (err ? kleur.red().bold("✘ ") : kleur.green().bold("✓ ")) +
      test +
      (err ? kleur.red("\n" + err.message) : "");

    console.log(txt);
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
  try {
    stdin.setRawMode(true);
    stdin.on("keypress", function(_, key) {
      if (key && /\r/.test(key.sequence)) {
        process.stdout.write(
          execSync(
            `${process.argv[0]} --experimental-modules ${process.argv
              .slice(1)
              .join(" ")}`
          )
        );
      }
      if (key && key.ctrl && key.name == "c") process.exit();
    });
  } catch (err) {}

  executeTests();
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
