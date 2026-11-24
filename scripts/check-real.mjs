// Real REST tests skip without a Forgetful checkout. This check must not let them skip.
if (!process.env.FORGETFUL_TEST_SOURCE) {
  console.error("Set FORGETFUL_TEST_SOURCE to a Forgetful checkout that has its .venv.");
  process.exit(1);
}
