/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

const BOOL_PREF = "devtools.test.settings.bool";
const OTHER_BOOL_PREF = "devtools.test.settings.other-bool";
const STRING_PREF = "devtools.test.settings.string";
const INT_PREF = "devtools.test.settings.int";

add_task(test_external_changes);
add_task(test_external_changes_dispatch_no_action);
add_task(test_rebinding);
add_task(test_replacement_control);
add_task(test_reconnection);

async function test_external_changes() {
  await pushPref(BOOL_PREF, false);
  await pushPref(STRING_PREF, "a");
  await pushPref(INT_PREF, 1);
  const { root } = await openSettings();
  const checkbox = await appendBinding(root, BOOL_PREF, createCheckbox(root));
  const selectControls = [];
  for (const createControl of [createSelect, createSegmentedControl]) {
    selectControls.push({
      string: await appendBinding(
        root,
        STRING_PREF,
        createControl(root, ["a", "b"])
      ),
      int: await appendBinding(root, INT_PREF, createControl(root, ["1", "2"])),
    });
  }

  is(checkbox.checked, false, "The checkbox reads the bool pref");
  for (const { string, int } of selectControls) {
    is(string.value, "a", `The ${string.localName} reads the string pref`);
    is(int.value, "1", `The ${int.localName} reads the int pref`);
  }

  Services.prefs.setBoolPref(BOOL_PREF, true);
  Services.prefs.setStringPref(STRING_PREF, "b");
  Services.prefs.setIntPref(INT_PREF, 2);

  is(checkbox.checked, true, "The checkbox follows an external bool change");
  for (const { string, int } of selectControls) {
    is(
      string.value,
      "b",
      `The ${string.localName} follows an external string change`
    );
    is(int.value, "2", `The ${int.localName} follows an external int change`);
  }

  await closeTabAndToolbox();
}

async function test_external_changes_dispatch_no_action() {
  await pushPref(BOOL_PREF, false);
  const { root } = await openSettings();
  const checkbox = await appendBinding(root, BOOL_PREF, createCheckbox(root));
  const binding = checkbox.parentElement;
  binding.setAttribute("change-action", "test-action");
  await binding.updateComplete;
  let changes = 0;
  binding.addEventListener("devtools-setting-changed", event => {
    // The panel throws on unknown callbacks like "test-action".
    event.stopPropagation();
    changes++;
  });

  Services.prefs.setBoolPref(BOOL_PREF, true);
  Services.prefs.setBoolPref(BOOL_PREF, false);
  await checkbox.updateComplete;
  is(changes, 0, "External changes emit no event");

  checkbox.click();
  await checkbox.updateComplete;
  is(changes, 1, "A user edit emits exactly one event");

  await closeTabAndToolbox();
}

async function test_rebinding() {
  await pushPref(BOOL_PREF, true);
  await pushPref(OTHER_BOOL_PREF, false);
  const { root } = await openSettings();
  const checkbox = await appendBinding(root, BOOL_PREF, createCheckbox(root));
  const binding = checkbox.parentElement;
  is(checkbox.checked, true, "The binding reads its first pref");

  binding.setAttribute("pref", OTHER_BOOL_PREF);
  await binding.updateComplete;
  is(checkbox.checked, false, "The binding reads its new pref");

  checkbox.checked = true;
  Services.prefs.setBoolPref(BOOL_PREF, false);
  is(checkbox.checked, true, "The binding ignores its old pref");

  checkbox.checked = false;
  Services.prefs.setBoolPref(OTHER_BOOL_PREF, true);
  is(checkbox.checked, true, "The binding observes its new pref");

  await closeTabAndToolbox();
}

async function test_replacement_control() {
  await pushPref(BOOL_PREF, true);
  const { root } = await openSettings();
  const checkbox = await appendBinding(root, BOOL_PREF, createCheckbox(root));
  const binding = checkbox.parentElement;
  const replacement = createCheckbox(root);
  const slotChanged = BrowserTestUtils.waitForEvent(
    binding.shadowRoot,
    "slotchange"
  );
  checkbox.replaceWith(replacement);
  await slotChanged;
  is(replacement.checked, true, "A replacement control reads the pref");

  Services.prefs.setBoolPref(BOOL_PREF, false);
  is(replacement.checked, false, "A replacement control follows the pref");

  await closeTabAndToolbox();
}

async function test_reconnection() {
  await pushPref(BOOL_PREF, true);
  const { root } = await openSettings();
  const checkbox = await appendBinding(root, BOOL_PREF, createCheckbox(root));
  const binding = checkbox.parentElement;
  is(checkbox.checked, true, "The binding reads its pref");
  binding.remove();

  Services.prefs.setBoolPref(BOOL_PREF, false);
  is(checkbox.checked, true, "A disconnected binding ignores its pref");

  binding.setAttribute("pref", OTHER_BOOL_PREF);
  await pushPref(OTHER_BOOL_PREF, false);
  root.shadowRoot.append(binding);
  is(checkbox.checked, false, "A reconnected binding reads its current pref");

  Services.prefs.setBoolPref(OTHER_BOOL_PREF, true);
  is(checkbox.checked, true, "A reconnected binding observes its pref");

  await closeTabAndToolbox();
}

/**
 * Append a binding wrapping a control to the settings root, so that closing
 * the toolbox removes it.
 *
 * @param {DevToolsSettings} root
 * @param {string} pref The pref to bind the control to
 * @param {Element} control
 * @return {Promise<Element>} the control, once it has rendered and been laid out
 */
async function appendBinding(root, pref, control) {
  const binding = root.ownerDocument.createElement("devtools-settings-pref");
  binding.setAttribute("pref", pref);
  binding.append(control);
  root.shadowRoot.append(binding);
  await binding.updateComplete;
  await control.updateComplete;
  await waitFor(
    () => control.getBoundingClientRect().height > 0,
    "The control has been laid out"
  );
  return control;
}

/** @param {DevToolsSettings} root */
function createCheckbox(root) {
  const checkbox = root.ownerDocument.createElement("moz-checkbox");
  checkbox.setAttribute("label", "Test setting");
  return checkbox;
}

/**
 * @param {DevToolsSettings} root
 * @param {string[]} values
 */
function createSelect(root, values) {
  const doc = root.ownerDocument;
  const select = doc.createElement("moz-select");
  select.setAttribute("label", "Test setting");
  for (const value of values) {
    const option = doc.createElement("moz-option");
    option.setAttribute("value", value);
    option.setAttribute("label", value);
    select.append(option);
  }
  return select;
}

/**
 * @param {DevToolsSettings} root
 * @param {string[]} values
 */
function createSegmentedControl(root, values) {
  const doc = root.ownerDocument;
  const control = doc.createElement("moz-segmented-control");
  control.setAttribute("label", "Test setting");
  for (const value of values) {
    const item = doc.createElement("moz-segmented-control-item");
    item.setAttribute("value", value);
    item.setAttribute("label", value);
    control.append(item);
  }
  return control;
}
