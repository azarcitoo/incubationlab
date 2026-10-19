import assert from "node:assert/strict";
import test from "node:test";
import { assessLaboratorySettings, getLaboratoryReference } from "../app/data/laboratory.ts";

test("uses different published temperature references for incubator types", () => {
  const forcedAir = assessLaboratorySettings({
    day: 1,
    incubatorType: "forced-air",
    temperatureF: 100,
    wetBulbF: 86,
    turningEnabled: true,
    ventilationProgressive: true,
  });
  const stillAir = assessLaboratorySettings({
    day: 1,
    incubatorType: "still-air",
    temperatureF: 102,
    wetBulbF: 86,
    turningEnabled: true,
    ventilationProgressive: true,
  });

  assert.equal(forcedAir.temperature, "within");
  assert.equal(stillAir.temperature, "within");
  assert.equal(forcedAir.referenceTemperatureF, 100);
  assert.equal(stillAir.referenceTemperatureF, 102);
});

test("switches humidity and turning references after day 18", () => {
  assert.deepEqual(getLaboratoryReference(18).wetBulbF, "85–87 °F");
  assert.deepEqual(getLaboratoryReference(19).wetBulbF, "89–90 °F");
  assert.equal(getLaboratoryReference(18).turning, "2–3 veces al día");
  assert.equal(getLaboratoryReference(19).turning, "detener el volteo");
});

test("assesses input values against the selected day and identifies turning mismatch", () => {
  const assessment = assessLaboratorySettings({
    day: 20,
    incubatorType: "forced-air",
    temperatureF: 100,
    wetBulbF: 86,
    turningEnabled: true,
    ventilationProgressive: false,
  });

  assert.equal(assessment.temperature, "within");
  assert.equal(assessment.humidity, "below");
  assert.equal(assessment.turningMatchesReference, false);
});
