import assert from "node:assert/strict";
import test from "node:test";
import { assessLaboratorySettings, getLaboratoryReference } from "../app/data/laboratory.ts";

test("uses different published temperature references for incubator types", () => {
  const forcedAir = assessLaboratorySettings({
    day: 1,
    incubatorType: "forced-air",
    temperatureC: 37.8,
    wetBulbC: 30,
    turningEnabled: true,
    ventilationProgressive: true,
  });
  const stillAir = assessLaboratorySettings({
    day: 1,
    incubatorType: "still-air",
    temperatureC: 38.9,
    wetBulbC: 30,
    turningEnabled: true,
    ventilationProgressive: true,
  });

  assert.equal(forcedAir.temperature, "within");
  assert.equal(stillAir.temperature, "within");
  assert.equal(forcedAir.referenceTemperatureC.toFixed(1), "37.8");
  assert.equal(stillAir.referenceTemperatureC.toFixed(1), "38.9");
});

test("uses the converted Celsius tolerance and wet-bulb reference limits", () => {
  const withinForcedAirReference = assessLaboratorySettings({
    day: 10,
    incubatorType: "forced-air",
    temperatureC: 38.3,
    wetBulbC: 29.5,
    turningEnabled: true,
    ventilationProgressive: true,
  });
  const aboveForcedAirReference = assessLaboratorySettings({
    day: 10,
    incubatorType: "forced-air",
    temperatureC: 38.4,
    wetBulbC: 30.7,
    turningEnabled: true,
    ventilationProgressive: true,
  });

  assert.equal(withinForcedAirReference.temperature, "within");
  assert.equal(withinForcedAirReference.humidity, "within");
  assert.equal(aboveForcedAirReference.temperature, "above");
  assert.equal(aboveForcedAirReference.humidity, "above");
});

test("switches humidity and turning references after day 18", () => {
  assert.equal(getLaboratoryReference(18).wetBulbRangeC, "29,4–30,6 °C");
  assert.equal(getLaboratoryReference(19).wetBulbRangeC, "31,7–32,2 °C");
  assert.equal(getLaboratoryReference(18).turning, "2–3 veces al día");
  assert.equal(getLaboratoryReference(19).turning, "detener el volteo");
});

test("assesses input values against the selected day and identifies turning mismatch", () => {
  const assessment = assessLaboratorySettings({
    day: 20,
    incubatorType: "forced-air",
    temperatureC: 37.8,
    wetBulbC: 29,
    turningEnabled: true,
    ventilationProgressive: false,
  });

  assert.equal(assessment.temperature, "within");
  assert.equal(assessment.humidity, "below");
  assert.equal(assessment.turningMatchesReference, false);
});
