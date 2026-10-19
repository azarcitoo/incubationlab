export type IncubatorType = "forced-air" | "still-air";
export type Comparison = "below" | "within" | "above";

export type LaboratorySettings = {
  day: number;
  incubatorType: IncubatorType;
  temperatureC: number;
  wetBulbC: number;
  turningEnabled: boolean;
  ventilationProgressive: boolean;
};

export type LaboratoryAssessment = {
  temperature: Comparison;
  humidity: Comparison;
  turningMatchesReference: boolean;
  referenceTemperatureC: number;
  wetBulbRangeC: readonly [number, number];
};

const temperatureReferencesC: Record<IncubatorType, number> = {
  "forced-air": 37.7777777778,
  "still-air": 38.8888888889,
};

const temperatureToleranceC = 5 / 9;

function compare(value: number, minimum: number, maximum: number): Comparison {
  if (value < minimum) return "below";
  if (value > maximum) return "above";
  return "within";
}

export function assessLaboratorySettings(
  settings: LaboratorySettings,
): LaboratoryAssessment {
  const lateIncubation = settings.day >= 19;
  const wetBulbRangeC: readonly [number, number] = lateIncubation
    ? [31.6666666667, 32.2222222222]
    : [29.4444444444, 30.5555555556];
  const referenceTemperatureC = temperatureReferencesC[settings.incubatorType];

  return {
    temperature: compare(
      settings.temperatureC,
      referenceTemperatureC - temperatureToleranceC,
      referenceTemperatureC + temperatureToleranceC,
    ),
    humidity: compare(settings.wetBulbC, wetBulbRangeC[0], wetBulbRangeC[1]),
    turningMatchesReference: settings.day <= 18
      ? settings.turningEnabled
      : !settings.turningEnabled,
    referenceTemperatureC,
    wetBulbRangeC,
  };
}

export function getLaboratoryReference(day: number) {
  return {
    humidityRelativePercent: day <= 18 ? "58–60 %" : "al menos 65 %",
    wetBulbRangeC: day <= 18 ? "29,4–30,6 °C" : "31,7–32,2 °C",
    turning: day <= 18 ? "2–3 veces al día" : "detener el volteo",
  };
}
