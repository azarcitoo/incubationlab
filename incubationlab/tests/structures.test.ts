import assert from "node:assert/strict";
import test from "node:test";
import { developmentDays } from "../app/data/development.ts";
import { structureCatalog } from "../app/data/structures.ts";

test("every structure listed across the 21 development days has a complete definition", () => {
  const listedStructures = new Set(
    developmentDays.flatMap(({ structures }) => structures),
  );
  const missingDefinitions = [...listedStructures].filter(
    (structure) => !(structure in structureCatalog),
  );

  assert.equal(developmentDays.length, 21);
  assert.equal(listedStructures.size, 40);
  assert.deepEqual(missingDefinitions, []);

  for (const structure of listedStructures) {
    const definition = structureCatalog[structure];
    assert.ok(definition.definition.trim().length > 40, structure);
    assert.ok(definition.role.trim().length > 30, structure);
    assert.ok(definition.development.trim().length > 15, structure);
  }
});

test("all structure definitions have citations and do not use the removed generic copy", () => {
  for (const [name, definition] of Object.entries(structureCatalog)) {
    assert.ok(definition.source === "development" || definition.source === "incubation", name);
    assert.ok(!JSON.stringify(definition).includes("mencionada en la ficha educativa"), name);
  }
});
